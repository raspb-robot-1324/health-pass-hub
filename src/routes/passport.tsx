import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Phone, Droplet, HeartPulse, Pill, User } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Emergency Passport — Pulseid" },
      { name: "description", content: "Critical medical info for first responders." },
    ],
  }),
  component: Passport,
});

function Passport() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border pb-8"
        >
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-emergency">// Emergency Passport</div>
          <h1 className="mt-3 font-display text-7xl leading-[1] tracking-tight md:text-8xl">
            Alex <span className="italic">Morgan</span>
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>Age 34</span>
            <span>Female</span>
            <span>San Francisco · CA</span>
            <span>Pulseid #ax-m72k</span>
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
            <span className="font-mono text-xs">verified · 12.04.26</span>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            <Field icon={Droplet} label="Blood type" value="O+" big />
            <Field icon={HeartPulse} label="Conditions" value="Asthma · HTN" big />
            <Field icon={Pill} label="Allergies" value="Penicillin" big />
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
              {[
                { n: "Atorvastatin", d: "10 mg · evening" },
                { n: "Albuterol", d: "Inhaler · as needed" },
                { n: "Lisinopril", d: "5 mg · morning" },
              ].map((m, i) => (
                <li key={m.n} className="flex items-baseline justify-between py-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    <span className="font-display text-2xl">{m.n}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{m.d}</span>
                </li>
              ))}
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
              {[
                { n: "Sam Morgan", r: "Spouse", p: "+1 (415) 555-0192" },
                { n: "Dr. Elena Reyes", r: "Primary physician", p: "+1 (415) 555-0144" },
              ].map((c) => (
                <li key={c.n} className="rounded-2xl border border-border p-4">
                  <div className="flex items-baseline justify-between">
                    <div className="font-display text-2xl">{c.n}</div>
                    <a href={`tel:${c.p}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emergency text-emergency-foreground">
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.r} · {c.p}</div>
                </li>
              ))}
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
          <div>Last verified · Apr 12, 2026</div>
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
