// Lovable AI Gateway - medical assistant
// Modes: triage | interactions | summary | prep | finder
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  triage: `You are Pulseid's medical guidance assistant. You are NOT a doctor — never diagnose. Given a patient's symptoms, profile, medications, allergies and conditions, respond with: 1) likely category in plain language, 2) urgency level (Self-care / Routine visit / Same-day visit / Urgent — go to ER), 3) 2-4 concrete next steps. Be calm, brief, and explicit that this is guidance, not diagnosis. Use markdown.`,

  interactions: `You are a clinical pharmacology assistant. Given a list of the patient's current medications (and known allergies/conditions), identify potentially significant drug-drug interactions, contraindications, or duplications. Output as a markdown list grouped by severity (High / Moderate / Low). If no notable issues, say so plainly. Always end with: "Confirm with your pharmacist or doctor."`,

  summary: `You are Pulseid's weekly health-summary writer. Using the patient's profile, medications, conditions, and upcoming appointments, write a warm 4-6 sentence summary in plain English. Mention: adherence outlook, anything to watch this week, and the next scheduled appointment. No medical jargon.`,

  prep: `You are an appointment-prep coach. Given the patient's profile and the upcoming appointment (with specialty), produce a tight markdown checklist: (a) 4-6 questions to ask the doctor, (b) information to bring, (c) one preparation tip (e.g., fasting, list of meds). Keep it practical and Quebec-aware where relevant.`,

  finder: `You are a Quebec healthcare navigator. Given a symptom or concern, recommend: 1) the most relevant medical specialty, 2) where to look in Quebec (Clic Santé / Bonjour-santé / RVSQ for primary care; CLSC for non-urgent walk-in; Info-Santé 811 for advice; ER if urgent). Provide the actual booking URLs (https://clicsante.ca, https://bonjour-sante.ca, https://rvsq.gouv.qc.ca). Keep it under 120 words and reassuring.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, payload } = await req.json();
    const system = SYSTEM_PROMPTS[mode];
    if (!system) {
      return new Response(JSON.stringify({ error: "Unknown mode" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userContent = buildUserMessage(mode, payload);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit reached. Please retry shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Top up in Workspace > Usage." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("medical-ai error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

function buildUserMessage(mode: string, p: any): string {
  const profile = p?.profile
    ? `Patient: ${p.profile.full_name}, ${p.profile.age ?? "?"} y/o ${p.profile.sex ?? ""}, blood ${p.profile.blood_type ?? "?"}, ${p.profile.city ?? ""}.`
    : "";
  const conds = p?.conditions?.length ? `Conditions: ${p.conditions.map((c: any) => c.name).join(", ")}.` : "";
  const allergies = p?.allergies?.length ? `Allergies: ${p.allergies.map((a: any) => a.name).join(", ")}.` : "";
  const meds = p?.medications?.length
    ? `Medications: ${p.medications.map((m: any) => `${m.name} ${m.dose ?? ""} (${m.schedule ?? ""})`).join("; ")}.`
    : "";

  const ctx = [profile, conds, allergies, meds].filter(Boolean).join(" ");

  if (mode === "triage") return `${ctx}\n\nSymptoms: ${p.symptoms ?? "(none described)"}`;
  if (mode === "interactions") return ctx || "No medications listed.";
  if (mode === "summary") {
    const appts = p?.appointments?.length
      ? `Upcoming: ${p.appointments.map((a: any) => `${a.title} on ${new Date(a.starts_at).toDateString()}`).join("; ")}.`
      : "No upcoming appointments.";
    return `${ctx} ${appts}`;
  }
  if (mode === "prep") {
    const appt = p?.appointment
      ? `Upcoming appointment: ${p.appointment.title} with ${p.appointment.doctor ?? "doctor"} (${p.appointment.specialty ?? ""}) on ${new Date(p.appointment.starts_at).toDateString()} at ${p.appointment.location ?? ""}.`
      : "No appointment provided.";
    return `${ctx}\n${appt}`;
  }
  if (mode === "finder") return `${ctx}\nConcern: ${p.concern ?? ""}`;
  return ctx;
}
