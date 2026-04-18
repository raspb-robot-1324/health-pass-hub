import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle, Phone, Droplet, HeartPulse, Pill } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Emergency Passport — PulseID" },
      { name: "description", content: "Critical medical info — blood type, allergies, conditions and emergency contacts — visible to first responders in seconds." },
      { property: "og:title", content: "Emergency Passport — PulseID" },
      { property: "og:description", content: "Critical medical info for first responders." },
    ],
  }),
  component: Passport,
});

function Passport() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emergency text-emergency-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emergency">Emergency Passport</div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Alex Morgan, 34</h1>
          </div>
        </div>

        {/* Critical band */}
        <div className="mt-8 overflow-hidden rounded-3xl border-2 border-emergency/30 bg-card shadow-elegant">
          <div className="flex items-center gap-2 bg-emergency px-6 py-3 text-sm font-semibold uppercase tracking-wider text-emergency-foreground">
            <AlertTriangle className="h-4 w-4" /> Critical info — show to medical personnel
          </div>
          <div className="grid gap-6 p-7 md:grid-cols-3">
            <Field icon={Droplet} label="Blood type" value="O+" />
            <Field icon={HeartPulse} label="Conditions" value="Asthma · Hypertension" />
            <Field icon={Pill} label="Allergies" value="Penicillin · Peanuts" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <h2 className="font-display text-lg font-semibold">Current medications</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {["Atorvastatin 10 mg — evening", "Albuterol inhaler — as needed", "Lisinopril 5 mg — morning"].map((m) => (
                <li key={m} className="rounded-xl bg-secondary px-3 py-2">{m}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <h2 className="font-display text-lg font-semibold">Emergency contacts</h2>
            <ul className="mt-4 space-y-3">
              {[
                { n: "Sam Morgan", r: "Spouse", p: "+1 (415) 555-0192" },
                { n: "Dr. Elena Reyes", r: "Primary physician", p: "+1 (415) 555-0144" },
              ].map((c) => (
                <li key={c.n} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <div className="text-sm font-semibold">{c.n}</div>
                    <div className="text-xs text-muted-foreground">{c.r}</div>
                  </div>
                  <a href={`tel:${c.p}`} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                    <Phone className="h-3 w-3" /> Call
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          This passport is encrypted and only the fields you mark as public appear here. Last updated Apr 12, 2026.
        </p>
      </main>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-2 font-display text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}
