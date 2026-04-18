import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowUpRight, ShieldCheck, QrCode, Activity, HeartPulse, Lock, Plus, Sparkles, Loader2, MapPin } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroOrb } from "@/components/HeroOrb";
import { EcgLine } from "@/components/EcgLine";
import { getActiveProfile, getMedicalBundle, callMedicalAI, type Profile, type Medication, type Allergy, type Condition } from "@/lib/medical";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulseid — Your medical life, in one signal" },
      { name: "description", content: "A medical OS for Quebec: live dashboard, emergency passport, secure QR key, and AI guidance." },
      { property: "og:title", content: "Pulseid" },
      { property: "og:description", content: "Medical dashboard, emergency passport, secure QR key." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    (async () => {
      const p = await getActiveProfile();
      setProfile(p);
      if (p) {
        const b = await getMedicalBundle(p.id);
        setMeds(b.medications);
        setAllergies(b.allergies);
        setConditions(b.conditions);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-gradient-hero grain">
        <div className="absolute inset-0 grid-lines opacity-60" />
        <motion.div style={{ y: orbY, scale: orbScale }} className="absolute inset-0 z-0">
          <HeroOrb />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="absolute right-8 top-32 z-20 hidden lg:block">
          <div className="animate-float rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-card w-56">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live signal
            </div>
            <div className="mt-2 font-display text-3xl">72<span className="text-base text-muted-foreground"> bpm</span></div>
            <EcgLine className="mt-1 h-8 w-full text-success" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="absolute left-8 bottom-32 z-20 hidden lg:block">
          <div className="animate-float rounded-2xl border border-emergency/40 bg-emergency/10 p-4 backdrop-blur-xl w-64" style={{ animationDelay: "2s" }}>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-emergency">
              <ShieldCheck className="h-3.5 w-3.5" /> Emergency passport
            </div>
            <div className="mt-2 font-display text-xl leading-tight">O+ · Penicillin · Asthma</div>
          </div>
        </motion.div>

        <motion.div style={{ y: titleY }} className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-12 bg-primary" /> A medical operating system · Québec, 2026
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(3rem,10vw,9rem)] leading-[0.92] tracking-tight">
            <SplitLine delay={0.3}>Your medical</SplitLine>
            <SplitLine delay={0.5}>life,&nbsp;<span className="italic text-primary">in one</span></SplitLine>
            <SplitLine delay={0.7}><span className="italic text-primary">signal.</span></SplitLine>
          </h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Pulseid weaves together a medical dashboard, an emergency passport, a revocable QR key, and AI guidance — built for Quebec patients and connected to Clic Santé, RVSQ and Bonjour-santé.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-foreground pl-6 pr-2 text-sm font-medium text-background transition hover:bg-primary">
                Enter the platform
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <Link to="/auth" className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <span className="relative">Create account
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-foreground transition-transform group-hover:scale-x-100" />
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <div>Montréal · QC</div>
          <div className="hidden md:block">Vital sync · stable · 99.99% uptime</div>
          <div>v.01 / 2026</div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative overflow-hidden border-y border-border bg-background py-8">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-12 pr-12 font-display text-4xl">
              {["Heartbeat", "Bloodwork", "Allergies", "History", "Vitals", "Medications", "Contacts", "Diagnoses"].map((w, j) => (
                <span key={`${i}-${j}`} className="flex items-center gap-12 text-muted-foreground">
                  {w}<Plus className="h-6 w-6 text-primary" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// 01 — Mission</div>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
              Healthcare in Quebec is <span className="italic text-primary">brilliant</span> — but the data lives in <span className="italic">silos.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
              We believe your medical life shouldn't be scattered across paper folders, hospital portals, and a wallet card you might forget. Pulseid puts it in your pocket — encrypted, scannable, and actually useful. Built for the realities of CLSCs, Clic Santé and Info-Santé 811.
            </p>
            <div className="mt-12 grid gap-6 border-t border-border pt-8 md:grid-cols-3">
              {[
                { v: "Patient-owned", l: "Your data, your keys, your call" },
                { v: "Quebec-first", l: "Wired to Clic Santé, RVSQ, 811" },
                { v: "Care-grade", l: "Built with clinicians, not for them" },
              ].map((x) => (
                <div key={x.v}>
                  <div className="font-display text-3xl tracking-tight text-primary">{x.v}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE PREVIEWS */}
      <section className="relative mx-auto max-w-7xl px-6 pb-32">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// 02 — Live previews</div>
        <h2 className="mt-4 font-display text-5xl leading-[1] tracking-tight md:text-6xl">See it <span className="italic text-primary">breathing.</span></h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <QRPreview profile={profile} />
          <ProfilePreview profile={profile} meds={meds} allergies={allergies} conditions={conditions} />
          <AIPreview profile={profile} meds={meds} allergies={allergies} conditions={conditions} />
        </div>
      </section>

      {/* TEAM */}
      <section className="relative mx-auto max-w-7xl px-6 py-32 border-t border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// 03 — The crew</div>
            <h2 className="mt-4 font-display text-5xl leading-[1] tracking-tight md:text-6xl">Three people, <span className="italic text-primary">one mission.</span></h2>
          </div>
          <div className="md:col-span-8 grid gap-4 sm:grid-cols-3">
            {[
              { name: "Founder One", role: "CEO · Product", bio: "Spent a decade designing health products. Believes interfaces save lives.", hue: 215 },
              { name: "Founder Two", role: "CTO · Engineering", bio: "Built distributed systems at scale. Now applying them to vitals.", hue: 250 },
              { name: "Founder Three", role: "MD · Clinical Lead", bio: "Practicing physician in Montréal. Knows where the seams are.", hue: 95 },
            ].map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl border border-border bg-card p-5"
              >
                <div className="aspect-square overflow-hidden rounded-2xl" style={{ background: `radial-gradient(circle at 30% 30%, oklch(0.6 0.18 ${m.hue}), oklch(0.2 0.04 240))` }}>
                  <div className="flex h-full w-full items-end justify-start p-4 text-7xl font-display text-background/40 italic">{m.name.split(" ")[1]?.[0]}</div>
                </div>
                <div className="mt-4 font-display text-2xl">{m.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{m.role}</div>
                <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative overflow-hidden bg-foreground py-32 text-background">
        <div className="absolute inset-0 grain opacity-30" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// Manifesto</div>
          <p className="mt-8 font-display text-4xl leading-[1.15] tracking-tight md:text-6xl">
            Health data shouldn't sit in a portal you'll never visit. It should{" "}
            <span className="italic text-primary">travel with you</span>, surface{" "}
            <span className="italic text-primary">when you need it</span>, and answer to{" "}
            <span className="italic text-primary">no one but you.</span>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7 md:col-start-2">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// Begin</div>
            <h2 className="mt-6 font-display text-6xl leading-[1] tracking-tight md:text-8xl">
              The clearest picture<br />of <span className="italic text-primary">your health,</span><br />when it counts.
            </h2>
          </div>
          <div className="md:col-span-3 md:col-start-10 space-y-4">
            <Link to="/dashboard" className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition hover:border-primary">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Step one</div>
                <div className="mt-1 font-display text-2xl">Open the app</div>
              </div>
              <HeartPulse className="h-6 w-6 text-primary" />
            </Link>
            <div className="flex items-center gap-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Lock className="h-3 w-3" /> end-to-end encrypted · always
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© 2026 Pulseid Health · Made in Montréal</div>
          <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> All systems nominal</div>
          <div>Connected to Clic Santé · RVSQ · 811</div>
        </div>
      </footer>
    </div>
  );
}

function SplitLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.span>
    </span>
  );
}

function QRPreview({ profile }: { profile: Profile | null }) {
  const url = `https://pulseid.health/p/${profile?.pulseid_code ?? "ax-m72k"}`;
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2"><QrCode className="h-4 w-4 text-primary" /><span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">QR key · live</span></div>
      <div className="mt-5 rounded-2xl bg-foreground p-4">
        <div className="rounded-xl bg-background p-4">
          <QRCodeSVG value={url} size={200} level="H" bgColor="transparent" fgColor="oklch(0.97 0.01 220)" className="h-auto w-full" />
        </div>
      </div>
      <div className="mt-4 font-display text-2xl leading-tight">{profile?.full_name ?? "—"}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">#{profile?.pulseid_code ?? "—"}</div>
      <Link to="/qr" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">Open QR page <ArrowUpRight className="h-3 w-3" /></Link>
    </motion.div>
  );
}

function ProfilePreview({ profile, meds, allergies, conditions }: { profile: Profile | null; meds: Medication[]; allergies: Allergy[]; conditions: Condition[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Medical profile · live</span></div>
      <div className="mt-5 font-display text-3xl leading-tight">{profile?.full_name ?? "—"}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {profile?.city ?? "—"} · {profile?.age ?? "—"} y/o · {profile?.blood_type ?? "—"}</div>
      <div className="mt-5 space-y-3">
        <Row label="Allergies" items={allergies.map((a) => a.name)} tone="emergency" />
        <Row label="Conditions" items={conditions.map((c) => c.name)} />
        <Row label="Medications" items={meds.slice(0, 3).map((m) => `${m.name} ${m.dose ?? ""}`)} />
      </div>
      <Link to="/passport" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">Open passport <ArrowUpRight className="h-3 w-3" /></Link>
    </motion.div>
  );
}

function Row({ label, items, tone }: { label: string; items: string[]; tone?: "emergency" }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
        {items.map((i, idx) => (
          <span key={idx} className={`rounded-full px-2.5 py-1 text-xs ${tone === "emergency" ? "border border-emergency/40 bg-emergency/10 text-emergency" : "bg-secondary"}`}>{i}</span>
        ))}
      </div>
    </div>
  );
}

function AIPreview({ profile, meds, allergies, conditions }: { profile: Profile | null; meds: Medication[]; allergies: Allergy[]; conditions: Condition[] }) {
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!profile) return;
    setLoading(true);
    try {
      const c = await callMedicalAI("summary", { profile, medications: meds, allergies, conditions, appointments: [] });
      setOut(c);
    } catch (e) {
      setOut("Couldn't reach AI. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">AI analysis · live</span></div>
      <div className="mt-5 font-display text-2xl leading-tight">Generate a weekly health summary from this profile.</div>
      <button onClick={run} disabled={loading || !profile} className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-gradient-primary px-4 text-xs font-medium text-primary-foreground disabled:opacity-50">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        {loading ? "Analyzing…" : "Run analysis"}
      </button>
      {out && (
        <div className="prose prose-sm prose-invert mt-4 max-w-none rounded-2xl border border-border bg-background/40 p-4 text-sm">
          <ReactMarkdown>{out}</ReactMarkdown>
        </div>
      )}
      <Link to="/dashboard" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">Open AI panel <ArrowUpRight className="h-3 w-3" /></Link>
    </motion.div>
  );
}

// suppress unused import warning for Activity/Stethoscope
void Activity;
