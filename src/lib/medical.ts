import { supabase } from "@/integrations/supabase/client";

export const DEMO_PULSEID = "ax-m72k";

export type Profile = {
  id: string;
  full_name: string;
  age: number | null;
  sex: string | null;
  blood_type: string | null;
  city: string | null;
  pulseid_code: string | null;
  ramq_number: string | null;
  is_demo: boolean;
};

export type Medication = {
  id: string;
  name: string;
  dose: string | null;
  schedule: string | null;
  notes: string | null;
};

export type Appointment = {
  id: string;
  title: string;
  doctor: string | null;
  specialty: string | null;
  location: string | null;
  starts_at: string;
  status: string;
  notes: string | null;
};

export type Allergy = { id: string; name: string; severity: string | null };
export type Condition = { id: string; name: string; diagnosed_at: string | null };
export type Contact = { id: string; name: string; relation: string | null; phone: string };

export async function getActiveProfile(): Promise<Profile | null> {
  const { data: session } = await supabase.auth.getSession();
  if (session.session?.user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.session.user.id)
      .maybeSingle();
    if (data) return data as Profile;

    // If authenticated but no profile row exists yet (new signup), create one
    const newCode = 'p-' + crypto.randomUUID().split('-')[0];
    const { data: newProfile, error } = await supabase
      .from("profiles")
      .insert({
        user_id: session.session.user.id,
        full_name: session.session.user.email?.split("@")[0] || "New User",
        pulseid_code: newCode,
        is_demo: false,
      })
      .select()
      .maybeSingle();
      
    if (newProfile) return newProfile as Profile;
    if (error) console.error("Error creating profile:", error);
  }
  // fall back to demo
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("pulseid_code", DEMO_PULSEID)
    .maybeSingle();
  return (data as Profile) ?? null;
}

export async function getMedicalBundle(profileId: string) {
  const [meds, appts, allergies, conditions, contacts] = await Promise.all([
    supabase.from("medications").select("*").eq("profile_id", profileId).order("created_at"),
    supabase.from("appointments").select("*").eq("profile_id", profileId).order("starts_at"),
    supabase.from("allergies").select("*").eq("profile_id", profileId),
    supabase.from("conditions").select("*").eq("profile_id", profileId),
    supabase.from("emergency_contacts").select("*").eq("profile_id", profileId),
  ]);
  return {
    medications: (meds.data ?? []) as Medication[],
    appointments: (appts.data ?? []) as Appointment[],
    allergies: (allergies.data ?? []) as Allergy[],
    conditions: (conditions.data ?? []) as Condition[],
    contacts: (contacts.data ?? []) as Contact[],
  };
}

export async function callMedicalAI(mode: "triage" | "interactions" | "summary" | "prep" | "finder", payload: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("medical-ai", { body: { mode, payload } });
  if (error) throw error;
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return (data as { content: string }).content;
}
