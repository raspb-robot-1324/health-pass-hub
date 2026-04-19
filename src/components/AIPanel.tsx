import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { callMedicalAI, type Profile, type Medication, type Allergy, type Condition, type Appointment } from "@/lib/medical";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Sparkles, Loader2, Copy, ExternalLink, CheckCircle } from "lucide-react";

type Mode = "triage" | "interactions" | "summary" | "prep" | "finder" | "clicsante";

const MODES: { id: Mode; label: string; placeholder?: string }[] = [
  { id: "summary", label: "Weekly summary" },
  { id: "clicsante", label: "Clic Santé Autofill", placeholder: "What kind of appointment do you need?" },
  { id: "interactions", label: "Drug interactions" },
  { id: "triage", label: "Symptom triage", placeholder: "Describe your symptoms…" },
  { id: "finder", label: "Find a doctor (QC)", placeholder: "What's the concern?" },
];

export function AIPanel({
  profile,
  meds,
  allergies,
  conditions,
  appointments,
  compact,
}: {
  profile: Profile | null;
  meds: Medication[];
  allergies: Allergy[];
  conditions: Condition[];
  appointments: Appointment[];
  compact?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("summary");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const needsInput = mode === "triage" || mode === "finder" || mode === "clicsante";

  async function run() {
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const payload: Record<string, unknown> = {
        profile,
        medications: meds,
        allergies,
        conditions,
        appointments,
      };
      if (mode === "triage") payload.symptoms = input;
      if (mode === "finder" || mode === "clicsante") payload.concern = input;
      
      let content;
      if (mode === "clicsante") {
        // AI fallback logic for Clic Sante
        content = `### Auto-fill Summary for Clic Santé\n\n**RAMQ/NAM:** (Please input manually)\n**Name:** ${profile?.full_name}\n**Gender:** ${profile?.sex || "-"}\n**Concerns:** ${input}\n**Medications:** ${meds.length} active\n**Allergies:** ${allergies.map(a=>a.name).join(', ') || 'None'}\n\n*Copy this summary and paste it into the "Reason for consultation" box when booking your appointment.*`;
      } else {
        content = await callMedicalAI(mode, payload);
      }
      setOutput(content);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-border bg-card ${compact ? "p-6" : "p-8"}`}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">// Pulseid AI</div>
          <div className="font-display text-xl">Medical assistant</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setOutput(""); setError(null); setInput(""); }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              mode === m.id
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {needsInput && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          placeholder={MODES.find((m) => m.id === mode)?.placeholder}
          className="mt-4 w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      )}

      <button
        onClick={run}
        disabled={loading || (needsInput && !input.trim())}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-gradient-primary px-5 text-sm font-medium text-primary-foreground transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Thinking…" : "Run"}
      </button>

      {error && (
        <div className="mt-4 rounded-xl border border-emergency/40 bg-emergency/10 p-3 text-sm text-emergency">
          {error}
        </div>
      )}

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-2xl border border-border bg-background/40 p-5"
        >
          <div className="prose prose-sm prose-invert max-w-none text-foreground mb-4">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
          
          {mode === "clicsante" && (
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border mt-4">
              <button 
                onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm transition hover:bg-secondary focus:outline-none"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                {copied ? "Copied" : "Copy for Clic Santé"}
              </button>
              <a 
                href="https://portal3.clicsante.ca/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-sm transition hover:bg-primary font-medium focus:outline-none"
              >
                <ExternalLink className="h-4 w-4" /> Go to portal
              </a>
            </div>
          )}
        </motion.div>
      )}

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Guidance only. Not a diagnosis.
      </p>
    </div>
  );
}

// Use signOut for header
export async function signOut() {
  await supabase.auth.signOut();
}
