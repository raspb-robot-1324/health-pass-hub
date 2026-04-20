import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, User, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getActiveProfile, type Profile } from "@/lib/medical";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingFlow,
});

function OnboardingFlow() {
  const navigate = useNavigate({ from: Route.id });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [ramq, setRamq] = useState("");
  const [sex, setSex] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    (async () => {
      const p = await getActiveProfile();
      if (!p) {
        navigate({ to: "/auth" });
        return;
      }
      if (p.is_demo) {
        navigate({ to: "/" });
        return;
      }
      // If already fully onboarded, kick them to dashboard
      if (p.ramq_number && p.age && p.bloodType) {
         // Optionally check conditions etc.
      }
      setProfile(p);
      setAge(p.age?.toString() || "");
      setBloodType(p.blood_type || "");
      setRamq(p.ramq_number || "");
      setSex(p.sex || "");
      setCity(p.city || "");
      setLoading(false);
    })();
  }, [navigate]);

  const handleComplete = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await supabase.from("profiles").update({ 
        age: parseInt(age) || null,
        blood_type: bloodType,
        ramq_number: ramq,
        sex,
        city
      }).eq("id", profile.id);
      
      // Force completion, route to dashboard
      navigate({ to: "/dashboard" });
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex flex-col items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const steps = [
    { num: 1, title: "Welcome to Novera", icon: ShieldCheck },
    { num: 2, title: "Critical Details", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* LEFT: Marketing / Progress Context */}
      <div className="hidden lg:flex w-1/3 bg-card border-r border-border p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="font-display tracking-tight text-3xl mb-12">Novera.</div>
          <div className="space-y-8">
            {steps.map(s => (
              <div key={s.num} className={`flex items-center gap-4 transition-opacity ${step === s.num ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`h-10 w-10 flex items-center justify-center rounded-xl border ${step === s.num ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Step 0{s.num}</div>
                  <div className="font-display text-xl">{s.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-hero opacity-30 z-0 pointer-events-none" />
      </div>

      {/* RIGHT: Main Form Interface */}
      <div className="flex-1 flex flex-col justify-center px-6 py-20 lg:px-24 relative">
        <div className="max-w-xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// Secure Initialization</div>
                <h1 className="font-display text-5xl leading-tight">Let's encrypt your <br/><span className="text-primary">baseline health profile.</span></h1>
                <p className="text-muted-foreground text-lg">
                  Before we generate your revocable QR key, we need foundational information. This data is fully encrypted and never sold.
                </p>
                <button onClick={() => setStep(2)} className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 text-base font-medium transition hover:bg-primary w-full sm:w-auto">
                  Begin setup <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
               <div>
                  <h2 className="font-display text-4xl mb-2">Critical Details</h2>
                  <p className="text-muted-foreground">Required by Quebec first responders during code triage.</p>
               </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Age</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 34" className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Biological Sex</label>
                    <input value={sex} onChange={e => setSex(e.target.value)} placeholder="M / F / X" className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Blood Type</label>
                    <input value={bloodType} onChange={e => setBloodType(e.target.value)} placeholder="e.g. O+" className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">City</label>
                    <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Montreal" className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">RAMQ / Insurance Code</label>
                  <input value={ramq} onChange={e => setRamq(e.target.value)} placeholder="ABCD 1234 5678" className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" />
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-border">
                   <button onClick={() => setStep(1)} className="text-sm font-medium text-muted-foreground hover:text-foreground">Back</button>
                   <button onClick={handleComplete} disabled={saving || !ramq || !bloodType} className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 text-base font-medium transition hover:opacity-90 disabled:opacity-50">
                     {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete Identity"} {saving ? "" : <ArrowRight className="h-4 w-4" />}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
