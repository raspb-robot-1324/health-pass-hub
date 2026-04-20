import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Pill, Calendar, MapPin, Stethoscope, Plus, ExternalLink, AlertCircle, ShieldCheck, QrCode, ArrowRight } from "lucide-react";
import { AIPanel } from "@/components/AIPanel";
import { ProfileEditor } from "@/components/ProfileEditor";
import { getActiveProfile, getMedicalBundle, callMedicalAI, type Profile, type Medication, type Appointment, type Allergy, type Condition } from "@/lib/medical";

import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Novera" },
      { name: "description", content: "Your medical dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate({ from: Route.id });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [prepFor, setPrepFor] = useState<string | null>(null);
  const [prep, setPrep] = useState<string>("");
  const [prepLoading, setPrepLoading] = useState(false);

  const loadProfile = async () => {
    const p = await getActiveProfile();
    
    if (p && !p.is_demo && !p.ramq_number) {
      navigate({ to: "/onboarding", replace: true });
      return;
    }
    
    setProfile(p);
    if (p) {
      const b = await getMedicalBundle(p.id);
      setMeds(b.medications);
      setAppts(b.appointments);
      setAllergies(b.allergies);
      setConditions(b.conditions);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const [editorOpen, setEditorOpen] = useState(false);

  async function runPrep(a: Appointment) {
    setPrepFor(a.id);
    setPrepLoading(true);
    setPrep("");
    try {
      const out = await callMedicalAI("prep", { profile, medications: meds, allergies, conditions, appointment: a });
      setPrep(out);
    } catch (e) {
      setPrep("Couldn't generate prep notes. Try again.");
    } finally {
      setPrepLoading(false);
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const upcoming = appts.filter((a) => new Date(a.starts_at) > new Date()).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-28 md:pb-16">
        {profile.is_demo && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            ● Demo patient · sign in to use your own
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 border-b border-border pb-10 md:grid-cols-12 md:items-end"
        >
          <div className="md:col-span-8">
            <div className="flex items-center gap-4">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// Health overview</div>
              {!profile.is_demo && (
                <button 
                  onClick={() => setEditorOpen(true)}
                  className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-mono hover:bg-secondary hover:text-foreground transition text-muted-foreground"
                >
                  Edit profile
                </button>
              )}
            </div>
            <h1 className="mt-3 font-display text-6xl leading-[1] tracking-tight md:text-8xl">
              Hello, <span className="text-primary">{profile.full_name.split(" ")[0]}.</span>
            </h1>
          </div>
          <div className="md:col-span-4 space-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Stat l="Profile" v={`#${profile.pulseid_code ?? "—"}`} />
            <Stat l="Active meds" v={`${meds.length}`} />
            <Stat l="Upcoming" v={`${upcoming.length} appts`} />
            <Stat l="City" v={profile.city ?? "—"} />
          </div>
        </motion.div>

        {/* Quick-access cards for Passport & QR — always visible, especially useful on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 grid grid-cols-2 gap-3"
        >
          <Link
            to="/passport"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-emergency hover:bg-emergency/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emergency/10 text-emergency">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-display text-lg leading-tight">Emergency Passport</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Critical info for responders</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emergency transition" />
          </Link>
          <Link
            to="/qr"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:bg-primary/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <QrCode className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-display text-lg leading-tight">QR Key</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Print or share your key</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
          </Link>
        </motion.div>

        {/* Top row: Meds + Allergies/Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 grid gap-4 md:grid-cols-12"
        >
          <Card className="md:col-span-7" icon={Pill} label="Today's medications" right={`${taken.size}/${meds.length}`}>
            <ul className="mt-5 divide-y divide-border">
              {meds.map((m) => {
                const isTaken = taken.has(m.id);
                return (
                  <li key={m.id} className="flex items-center gap-4 py-4">
                    <button
                      onClick={() => {
                        const next = new Set(taken);
                        next.has(m.id) ? next.delete(m.id) : next.add(m.id);
                        setTaken(next);
                      }}
                      className={`h-5 w-5 shrink-0 rounded-full border transition ${isTaken ? "bg-success border-success" : "border-muted-foreground"}`}
                      aria-label="Toggle taken"
                    />
                    <div className="flex-1">
                      <div className="font-display text-2xl leading-tight">{m.name} <span className="text-muted-foreground text-base">{m.dose}</span></div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{m.schedule}{m.notes ? ` · ${m.notes}` : ""}</div>
                    </div>
                  </li>
                );
              })}
              {meds.length === 0 && <li className="py-6 text-sm text-muted-foreground">No medications yet.</li>}
            </ul>
          </Card>

          <div className="md:col-span-5 space-y-4">
            <Card icon={AlertCircle} label="Allergies & conditions" small>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Allergies</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {allergies.map((a) => (
                      <span key={a.id} className="rounded-full border border-emergency/40 bg-emergency/10 px-3 py-1 text-xs text-emergency">{a.name}{a.severity ? ` · ${a.severity}` : ""}</span>
                    ))}
                    {allergies.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Conditions</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {conditions.map((c) => (
                      <span key={c.id} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs">{c.name}</span>
                    ))}
                    {conditions.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                  </div>
                </div>
              </div>
            </Card>
            <Card icon={MapPin} label="Quick book (Quebec)" small>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {[
                  { n: "Clic Santé", u: "https://clicsante.ca" },
                  { n: "Bonjour-santé", u: "https://bonjour-sante.ca" },
                  { n: "RVSQ", u: "https://rvsq.gouv.qc.ca" },
                  { n: "Info-Santé 811", u: "tel:811" },
                ].map((b) => (
                  <a key={b.n} href={b.u} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-secondary px-3 py-2 hover:border-primary">
                    {b.n} <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Appointments + AI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 grid gap-4 md:grid-cols-12"
        >
          <Card className="md:col-span-7" icon={Calendar} label="Upcoming appointments">
            <ul className="mt-5 divide-y divide-border">
              {upcoming.map((a) => (
                <li key={a.id} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-display text-2xl">{a.title}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {new Date(a.starts_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} · {a.doctor} · {a.location}
                      </div>
                    </div>
                    <button
                      onClick={() => runPrep(a)}
                      className="shrink-0 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs hover:border-primary"
                    >
                      AI prep
                    </button>
                  </div>
                  {prepFor === a.id && (
                    <div className="mt-3 rounded-xl border border-border bg-background p-4 text-sm">
                      {prepLoading ? <span className="text-muted-foreground">Drafting prep notes…</span> : <pre className="whitespace-pre-wrap font-sans">{prep}</pre>}
                    </div>
                  )}
                </li>
              ))}
              {upcoming.length === 0 && <li className="py-6 text-sm text-muted-foreground">No upcoming appointments.</li>}
            </ul>
            <a href="https://clicsante.ca" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-primary">
              <Plus className="h-3 w-3" /> Book on Clic Santé
            </a>
          </Card>

          <div className="md:col-span-5">
            <AIPanel profile={profile} meds={meds} allergies={allergies} conditions={conditions} appointments={appts} />
          </div>
        </motion.div>

        <ProfileEditor 
          open={editorOpen} 
          onOpenChange={setEditorOpen} 
          profileId={profile.id} 
          onSaved={loadProfile} 
        />
      </main>
    </div>
  );
}

function Stat({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between"><span>{l}</span><span className="text-foreground">{v}</span></div>;
}

function Card({
  children, icon: Icon, label, right, className = "", small,
}: { children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; label: string; right?: string; className?: string; small?: boolean; }) {
  return (
    <div className={`rounded-3xl border border-border bg-card ${small ? "p-6" : "p-7"} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
        </div>
        {right && <span className="font-mono text-[10px] text-success">{right}</span>}
      </div>
      {children}
    </div>
  );
}
