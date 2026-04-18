import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ShieldCheck, QrCode, HeartPulse, Stethoscope, Lock, ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import heroImage from "@/assets/hero-medical.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PulseID — Medical dashboard, emergency passport & QR" },
      { name: "description", content: "A unified medical platform: track your health, carry an emergency passport, and share critical info instantly via secure QR." },
      { property: "og:title", content: "PulseID — Your medical life, one tap away" },
      { property: "og:description", content: "Medical dashboard, emergency passport, and secure QR — built for patients and first responders." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          width={1536}
          height={1024}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-luminosity"
        />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pt-20 pb-28 md:grid-cols-[1.1fr_0.9fr] md:pt-28">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> HIPAA-aware · Patient-owned data
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Your medical life,
              <br />
              <span className="text-gradient">one pulse away.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              PulseID brings together a real-time medical dashboard, an emergency passport for first responders, and a secure QR code — so the right people see the right information at the right moment.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-primary px-7 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:shadow-glow"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/qr"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background/80 px-7 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-secondary"
              >
                <QrCode className="h-4 w-4" /> Get my QR
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> End-to-end encrypted</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> 256-bit secure</div>
            </div>
          </div>

          {/* Floating preview card */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-primary opacity-20 blur-3xl" />
            <div className="relative w-full max-w-md rounded-[2rem] border border-border/60 bg-card/80 p-6 shadow-elegant backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Patient</div>
                  <div className="mt-1 font-display text-xl font-semibold">Alex Morgan</div>
                </div>
                <div className="flex h-10 w-10 animate-pulse-ring items-center justify-center rounded-full bg-emergency text-emergency-foreground">
                  <HeartPulse className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { l: "Heart", v: "72", u: "bpm" },
                  { l: "Oxygen", v: "98", u: "%" },
                  { l: "Glucose", v: "104", u: "mg/dL" },
                ].map((m) => (
                  <div key={m.l} className="rounded-2xl bg-secondary p-3">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{m.l}</div>
                    <div className="mt-1 font-display text-2xl font-bold text-primary-deep">{m.v}<span className="ml-0.5 text-xs font-medium text-muted-foreground">{m.u}</span></div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-emergency/20 bg-emergency/5 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emergency">
                  <ShieldCheck className="h-3.5 w-3.5" /> Emergency Passport
                </div>
                <div className="mt-2 text-sm text-foreground">
                  Type O+ · Allergic to penicillin · Asthma
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-foreground/95 p-4 text-background">
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-70">Scan to access</div>
                  <div className="font-display text-sm font-semibold">pulseid.health/ax-m72k</div>
                </div>
                <div className="rounded-lg bg-background p-1.5">
                  <QrCode className="h-8 w-8 text-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-2xl">
          <div className="text-sm font-medium uppercase tracking-wider text-primary">Three tools, one identity</div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">Built for everyday care, ready for emergencies.</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { icon: Activity, title: "Medical Dashboard", desc: "Live vitals, medications, lab history and clinician notes — beautifully organized in one place.", to: "/dashboard", cta: "Open dashboard" },
            { icon: ShieldCheck, title: "Emergency Passport", desc: "Blood type, allergies, conditions and contacts — instantly visible to first responders when seconds matter.", to: "/passport", cta: "View passport" },
            { icon: QrCode, title: "Secure QR Code", desc: "A printable, scannable code that surfaces only the data you choose — encrypted, revocable, always yours.", to: "/qr", cta: "Generate QR" },
          ].map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold">{f.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {f.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-4">
          {[
            { v: "8s", l: "Average scan-to-info" },
            { v: "256-bit", l: "Encryption everywhere" },
            { v: "120k+", l: "Patients onboarded" },
            { v: "1,400+", l: "Clinics integrated" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-5xl font-bold text-primary-glow">{s.v}</div>
              <div className="mt-2 text-sm text-background/70">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-28 text-center">
        <Stethoscope className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-5xl">
          The clearest picture of your health, <span className="text-gradient">whenever it counts.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Patients stay in control. Doctors get clarity. First responders save time. PulseID is the connective tissue of modern care.
        </p>
        <Link
          to="/dashboard"
          className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-primary px-8 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:shadow-glow"
        >
          Get started — it's free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} PulseID Health, Inc.</div>
          <div>Built for clarity. Designed for care.</div>
        </div>
      </footer>
    </div>
  );
}
