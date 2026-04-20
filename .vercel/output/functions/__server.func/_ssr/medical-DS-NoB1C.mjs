import { s as supabase } from "./client-BDew0MgD.mjs";
const DEMO_PULSEID = "ax-m72k";
async function getActiveProfile() {
  const { data: session } = await supabase.auth.getSession();
  if (session.session?.user) {
    const { data: data2 } = await supabase.from("profiles").select("*").eq("user_id", session.session.user.id).maybeSingle();
    if (data2) return data2;
    const newCode = "p-" + crypto.randomUUID().split("-")[0];
    const { data: newProfile, error } = await supabase.from("profiles").insert({
      user_id: session.session.user.id,
      full_name: session.session.user.email?.split("@")[0] || "New User",
      pulseid_code: newCode,
      is_demo: false
    }).select().maybeSingle();
    if (newProfile) return newProfile;
    if (error) console.error("Error creating profile:", error);
  }
  const { data } = await supabase.from("profiles").select("*").eq("pulseid_code", DEMO_PULSEID).maybeSingle();
  return data ?? null;
}
async function getMedicalBundle(profileId) {
  const [meds, appts, allergies, conditions, contacts] = await Promise.all([
    supabase.from("medications").select("*").eq("profile_id", profileId).order("created_at"),
    supabase.from("appointments").select("*").eq("profile_id", profileId).order("starts_at"),
    supabase.from("allergies").select("*").eq("profile_id", profileId),
    supabase.from("conditions").select("*").eq("profile_id", profileId),
    supabase.from("emergency_contacts").select("*").eq("profile_id", profileId)
  ]);
  return {
    medications: meds.data ?? [],
    appointments: appts.data ?? [],
    allergies: allergies.data ?? [],
    conditions: conditions.data ?? [],
    contacts: contacts.data ?? []
  };
}
async function callMedicalAI(mode, payload) {
  const { data, error } = await supabase.functions.invoke("medical-ai", { body: { mode, payload } });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data.content;
}
export {
  getMedicalBundle as a,
  callMedicalAI as c,
  getActiveProfile as g
};
