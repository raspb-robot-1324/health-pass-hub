import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Droplet, HeartPulse, Pill, Calendar, FileText, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { EcgLine } from "@/components/EcgLine";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Pulseid" },
      { name: "description", content: "Your living medical dashboard." },
    ],
  }),
  component: Dashboard,
});

const vitals = [
  { icon: HeartPulse, label: "Heart rate", value: "72", unit: "bpm", trend: "+2", color: "text-emergency", bars: [40, 60, 50, 80, 65, 70, 72] },
  { icon: Activity, label: "Pressure", value: "118/76", unit: "mmHg", trend: "stable", color: "text-primary", bars: [70, 65, 72, 68, 75, 70, 72] },
  { icon: Droplet, label: "Glucose", value: "104", unit: "mg/dL", trend: "−3", color: "text-success", bars: [90, 85, 80, 78, 82, 75, 70] },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 border-b border-border pb-10 md:grid-cols-12 md:items-end"
        >
          <div className="md:col-span-8">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// Health overview</div>
            <h1 className="mt-3 font-display text-6xl leading-[1] tracking-tight md:text-8xl">
              Hello, <span className="italic text-primary">Alex.</span>
            </h1>
          </div>
          <div className="md:col-span-4 space-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <div className="flex justify-between"><span>Last sync</span><span className="text-foreground">2 min ago</span></div>
            <div className="flex justify-between"><span>Status</span><span className="text-success">● nominal</span></div>
            <div className="flex justify-between"><span>Risk index</span><span className="text-foreground">low / 0.12</span></div>
          </div>
        </motion.div>

        {/* Vitals — asymmetric */}
        <div className="mt-10 grid gap-4 md:grid-cols-12">
          {vitals.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-7 ${i === 0 ? "md:col-span-5" : i === 1 ? "md:col-span-4" : "md:col-span-3"}`}
            >
              <div className="flex items-start justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{v.label}</div>
                <span className={`font-mono text-xs ${v.color}`}>{v.trend}</span>
              </div>
              <div className="mt-8 flex items-end justify-between gap-4">
                <div className="font-display text-6xl leading-none tracking-tight">
                  {v.value}<span className="ml-1 font-sans text-sm text-muted-foreground">{v.unit}</span>
                </div>
                <v.icon className={`h-8 w-8 ${v.color}`} strokeWidth={1.2} />
              </div>
              <div className="mt-6 flex h-12 items-end gap-1.5">
                {v.bars.map((h, j) => (
                  <div key={j} className="flex-1 rounded-t bg-gradient-primary opacity-70" style={{ height: `${h}%` }} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big ECG card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 grid gap-4 md:grid-cols-12"
        >
          <div className="md:col-span-8 relative overflow-hidden rounded-3xl border border-border bg-card p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Live ECG · Lead II</div>
                <div className="mt-2 font-display text-3xl">Sinus rhythm, normal</div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </div>
            <EcgLine className="mt-12 h-32 w-full text-primary" />
            <div className="mt-6 grid grid-cols-4 gap-4 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <div><div>PR</div><div className="mt-1 text-foreground">160 ms</div></div>
              <div><div>QRS</div><div className="mt-1 text-foreground">88 ms</div></div>
              <div><div>QT</div><div className="mt-1 text-foreground">380 ms</div></div>
              <div><div>Axis</div><div className="mt-1 text-foreground">+45°</div></div>
            </div>
          </div>

          <div className="md:col-span-4 rounded-3xl border border-border bg-card p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Today's regimen</span>
              </div>
              <span className="font-mono text-[10px] text-success">2 / 3</span>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                { n: "Atorvastatin", d: "10 mg · evening", taken: false },
                { n: "Lisinopril", d: "5 mg · morning", taken: true },
                { n: "Vitamin D3", d: "1000 IU · morning", taken: true },
              ].map((m) => (
                <li key={m.n} className="flex items-center gap-3 border-b border-border pb-3 last:border-0">
                  <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.taken ? "bg-success" : "border border-muted-foreground"}`} />
                  <div className="flex-1">
                    <div className="font-display text-xl leading-tight">{m.n}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{m.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Lower row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 grid gap-4 md:grid-cols-12"
        >
          <div className="md:col-span-5 rounded-3xl border border-border bg-card p-7">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Upcoming</span>
            </div>
            <ul className="mt-6 divide-y divide-border">
              {[
                { t: "Dr. Reyes — Cardiology", d: "Apr 22 · 10:30" },
                { t: "Annual blood panel", d: "May 04 · 08:00" },
                { t: "Dental cleaning", d: "May 18 · 14:00" },
              ].map((a) => (
                <li key={a.t} className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-display text-xl">{a.t}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{a.d}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 rounded-3xl border border-border bg-card p-7">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Recent labs</span>
            </div>
            <ul className="mt-6 space-y-4">
              {[
                { t: "Lipid panel", d: "Within range", v: "Mar 18", ok: true },
                { t: "HbA1c", d: "5.4% normal", v: "Feb 02", ok: true },
                { t: "Vitamin D", d: "Slightly low", v: "Jan 11", ok: false },
              ].map((a) => (
                <li key={a.t}>
                  <div className="flex items-baseline justify-between">
                    <div className="font-display text-xl">{a.t}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{a.v}</div>
                  </div>
                  <div className={`mt-1 font-mono text-xs ${a.ok ? "text-success" : "text-accent"}`}>● {a.d}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 rounded-3xl bg-gradient-primary p-7 text-primary-foreground relative overflow-hidden">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-80">Weekly insight</div>
            <div className="mt-6 font-display text-3xl leading-tight">
              Resting heart rate trended <em className="italic">down 4 bpm</em> this week.
            </div>
            <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full border border-primary-foreground/30" />
            <div className="absolute right-4 bottom-4 h-16 w-16 rounded-full bg-primary-foreground/20" />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
