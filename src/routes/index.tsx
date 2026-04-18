import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, ShieldCheck, QrCode, Activity, HeartPulse, Lock, Plus } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroOrb } from "@/components/HeroOrb";
import { EcgLine } from "@/components/EcgLine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulseid — Your medical life, in one signal" },
      { name: "description", content: "A medical OS: live dashboard, emergency passport, and a secure QR key. Built so the right care finds you in seconds." },
      { property: "og:title", content: "Pulseid — Your medical life, in one signal" },
      { property: "og:description", content: "Medical dashboard, emergency passport, and secure QR key." },
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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-gradient-hero grain">
        <div className="absolute inset-0 grid-lines opacity-60" />

        {/* 3D Orb behind text */}
        <motion.div
          style={{ y: orbY, scale: orbScale }}
          className="absolute inset-0 z-0"
        >
          <HeroOrb />
        </motion.div>

        {/* Floating chips */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute right-8 top-32 z-20 hidden lg:block"
        >
          <div className="animate-float rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-card w-56">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live signal
            </div>
            <div className="mt-2 font-display text-3xl">72<span className="text-base text-muted-foreground"> bpm</span></div>
            <EcgLine className="mt-1 h-8 w-full text-success" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute left-8 bottom-32 z-20 hidden lg:block"
        >
          <div className="animate-float rounded-2xl border border-emergency/40 bg-emergency/10 p-4 backdrop-blur-xl w-64" style={{ animationDelay: "2s" }}>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-emergency">
              <ShieldCheck className="h-3.5 w-3.5" /> Emergency passport
            </div>
            <div className="mt-2 font-display text-xl leading-tight">O+ · Penicillin allergy · Asthma</div>
          </div>
        </motion.div>

        {/* Hero copy */}
        <motion.div
          style={{ y: titleY }}
          className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            <span className="h-px w-12 bg-primary" />
            A medical operating system · est. 2026
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(3rem,10vw,9rem)] leading-[0.92] tracking-tight">
            <SplitLine delay={0.3}>Your medical</SplitLine>
            <SplitLine delay={0.5}>
              life,&nbsp;
              <span className="italic text-primary">in one</span>
            </SplitLine>
            <SplitLine delay={0.7}>
              <span className="italic text-primary">signal.</span>
            </SplitLine>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Pulseid weaves together a real-time dashboard, an emergency passport for first responders, and a revocable QR key — so the right people see what matters at the exact moment it matters.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-foreground pl-6 pr-2 text-sm font-medium text-background transition hover:bg-primary"
              >
                Enter the platform
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <Link to="/qr" className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <span className="relative">
                  Generate QR
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-foreground transition-transform group-hover:scale-x-100" />
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom corner labels */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <div>N 37.7749° · W 122.4194°</div>
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
                  {w}
                  <Plus className="h-6 w-6 text-primary" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES — asymmetric */}
      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// 01 — System</div>
            <h2 className="mt-6 font-display text-6xl leading-[1] tracking-tight md:text-7xl">
              Three instruments,
              <br />
              <span className="italic text-primary">one heartbeat.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Each module sings on its own — but together they form the connective tissue of modern care.
            </p>
          </div>

          <div className="md:col-span-7 space-y-6">
            {[
              {
                n: "/01",
                icon: Activity,
                t: "Living Dashboard",
                d: "Vitals, medications, lab history, clinician notes — composed like a magazine spread, refreshed in real time.",
                to: "/dashboard",
              },
              {
                n: "/02",
                icon: ShieldCheck,
                t: "Emergency Passport",
                d: "Blood type, allergies, conditions, contacts. A single tap. A single screen. The seconds that save a life.",
                to: "/passport",
                accent: true,
              },
              {
                n: "/03",
                icon: QrCode,
                t: "Sovereign QR Key",
                d: "Printable, scannable, revocable. You decide what's visible, who sees it, and for how long.",
                to: "/qr",
              },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link
                  to={f.to}
                  className={`group relative block overflow-hidden rounded-3xl border ${f.accent ? "border-emergency/30 bg-emergency/5" : "border-border bg-card"} p-8 transition hover:border-primary/60`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">{f.n}</div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:rotate-45 group-hover:text-primary" />
                  </div>
                  <div className="mt-12 flex items-end gap-4">
                    <f.icon className={`h-10 w-10 ${f.accent ? "text-emergency" : "text-primary"}`} strokeWidth={1.2} />
                    <h3 className="font-display text-5xl leading-none tracking-tight">{f.t}</h3>
                  </div>
                  <p className="mt-6 max-w-lg text-muted-foreground">{f.d}</p>
                  <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO BAND */}
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

          <div className="mt-20 grid gap-12 border-t border-background/10 pt-12 md:grid-cols-4">
            {[
              { v: "8s", l: "scan to information" },
              { v: "256", l: "bit encryption" },
              { v: "120k", l: "patients onboarded" },
              { v: "1.4k", l: "clinics integrated" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-display text-7xl tracking-tight text-primary">{s.v}</div>
                <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-background/60">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — broken grid */}
      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7 md:col-start-2">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// Begin</div>
            <h2 className="mt-6 font-display text-6xl leading-[1] tracking-tight md:text-8xl">
              The clearest picture
              <br />
              of <span className="italic text-primary">your health,</span>
              <br />
              when it counts.
            </h2>
          </div>
          <div className="md:col-span-3 md:col-start-10 space-y-4">
            <Link
              to="/dashboard"
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition hover:border-primary"
            >
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
          <div>© 2026 Pulseid Health · A medical OS</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> All systems nominal
          </div>
          <div>San Francisco · Berlin · Tokyo</div>
        </div>
      </footer>
    </div>
  );
}

function SplitLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
