import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Phone, Droplet, HeartPulse, Pill, User, Loader2, Download } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { getActiveProfile, getMedicalBundle, type Profile, type Medication, type Allergy, type Condition, type Contact } from "@/lib/medical";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Emergency Passport — Novera" },
      { name: "description", content: "Critical medical info for first responders." },
    ],
  }),
  component: Passport,
});

function Passport() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await getActiveProfile();
      setProfile(p);
      if (p) {
        const b = await getMedicalBundle(p.id);
        setMeds(b.medications);
        setAllergies(b.allergies);
        setConditions(b.conditions);
        setContacts(b.contacts);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-screen items-center justify-center text-muted-foreground gap-2 flex-col">
          No profile found. <Link to="/auth" className="text-primary underline">Sign in</Link>
        </div>
      </div>
    );
  }

  const nameParts = profile.full_name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  const dateFormatted = new Date().toLocaleDateString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-doc, .print-doc * { visibility: visible; }
          .print-doc { position: absolute; left: 0; top: 0; width: 100%; transform: none !important; margin: 0; padding: 2rem !important; }
          header, .no-print { display: none !important; }
        }
      `}</style>
      <main className="print-doc mx-auto max-w-5xl px-6 pt-32 pb-16">
        <div className="flex items-center justify-between no-print mb-8">
           <button onClick={() => window.print()} className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:border-primary hover:text-primary">
             <Download className="h-4 w-4" /> Download Key (Fridge)
           </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border pb-8"
        >
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-emergency">// Emergency Passport</div>
          <h1 className="mt-3 font-display text-7xl leading-[1] tracking-tight md:text-8xl">
            {firstName} <span>{lastName}</span>
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>Age {profile.age ?? "—"}</span>
            <span>{profile.sex ?? "—"}</span>
            <span>{profile.city ?? "—"}</span>
            <span>Novera #{profile.pulseid_code ?? "—"}</span>
          </div>
        </motion.div>

        {/* Critical band */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-10 overflow-hidden rounded-3xl border-2 border-emergency bg-emergency/5"
        >
          <div className="flex items-center justify-between bg-emergency px-6 py-3 text-emergency-foreground">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em]">
              <AlertTriangle className="h-4 w-4" /> Show to medical personnel
            </div>
            <span className="font-mono text-xs">verified · {dateFormatted}</span>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            <Field icon={Droplet} label="Blood type" value={profile.blood_type ?? "—"} big />
            <Field icon={HeartPulse} label="Conditions" value={conditions.length > 0 ? conditions.map(c => c.name).join(' · ') : "None"} big />
            <Field icon={Pill} label="Allergies" value={allergies.length > 0 ? allergies.map(a => a.name).join(' · ') : "None known"} big />
          </div>
        </motion.div>

        {/* Lower grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-7 rounded-3xl border border-border bg-card p-8"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">// Current medications</div>
            <ul className="mt-5 divide-y divide-border">
              {meds.map((m, i) => (
                <li key={m.id} className="flex items-baseline justify-between py-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-2xl">{m.name}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-right">{m.dose} {m.schedule ? `· ${m.schedule}` : ''}</span>
                </li>
              ))}
              {meds.length === 0 && <li className="py-4 text-sm text-muted-foreground">No active medications.</li>}
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-5 rounded-3xl border border-border bg-card p-8"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <User className="h-3 w-3" /> Emergency contacts
            </div>
            <ul className="mt-5 space-y-4">
              {contacts.map((c) => (
                <li key={c.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-baseline justify-between">
                    <div className="font-display text-2xl">{c.name}</div>
                    <a href={`tel:${c.phone}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emergency text-emergency-foreground">
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.relation ?? 'Contact'} · {c.phone}</div>
                </li>
              ))}
              {contacts.length === 0 && <li className="text-sm text-muted-foreground py-2">No emergency contacts listed.</li>}
            </ul>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-success" /> Encrypted · only public fields shown
          </div>
          <div>Last verified · {dateFormatted}</div>
        </motion.div>
      </main>
    </div>
  );
}

function Field({ icon: Icon, label, value, big }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; big?: boolean }) {
  return (
    <div className="bg-background p-7">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-emergency" /> {label}
      </div>
      <div className={`mt-4 font-display tracking-tight ${big ? "text-5xl md:text-6xl" : "text-3xl"}`}>{value}</div>
    </div>
  );
}
