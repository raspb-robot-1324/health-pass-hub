import { createFileRoute } from "@tanstack/react-router";
import { Activity, Droplet, HeartPulse, Pill, TrendingUp, Calendar, FileText } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PulseID" },
      { name: "description", content: "Your live medical dashboard: vitals, medications, labs and upcoming appointments." },
      { property: "og:title", content: "Dashboard — PulseID" },
      { property: "og:description", content: "Live vitals, medications and labs in one place." },
    ],
  }),
  component: Dashboard,
});

const vitals = [
  { icon: HeartPulse, label: "Heart rate", value: "72", unit: "bpm", trend: "+2", color: "text-emergency" },
  { icon: Activity, label: "Blood pressure", value: "118/76", unit: "mmHg", trend: "stable", color: "text-primary" },
  { icon: Droplet, label: "Glucose", value: "104", unit: "mg/dL", trend: "-3", color: "text-success" },
  { icon: TrendingUp, label: "Oxygen", value: "98", unit: "%", trend: "+1", color: "text-primary" },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm font-medium uppercase tracking-wider text-primary">Good morning, Alex</div>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Health overview</h1>
          </div>
          <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            Last sync · 2 min ago
          </div>
        </div>

        {/* Vitals */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {vitals.map((v) => (
            <div key={v.label} className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary ${v.color}`}>
                  <v.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">{v.trend}</span>
              </div>
              <div className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">{v.label}</div>
              <div className="mt-1 font-display text-3xl font-bold text-foreground">
                {v.value}<span className="ml-1 text-sm font-medium text-muted-foreground">{v.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-border bg-card p-7 shadow-card lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">7-day heart rate</h2>
              <span className="text-xs text-muted-foreground">avg 71 bpm</span>
            </div>
            <div className="mt-8 flex h-48 items-end gap-3">
              {[60, 72, 68, 80, 74, 70, 72].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-xl bg-gradient-primary"
                    style={{ height: `${h * 1.6}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Medications</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {[
                { n: "Atorvastatin", d: "10 mg · evening" },
                { n: "Albuterol", d: "Inhaler · as needed" },
                { n: "Vitamin D3", d: "1000 IU · morning" },
              ].map((m) => (
                <li key={m.n} className="flex items-center justify-between rounded-2xl bg-secondary p-3">
                  <div>
                    <div className="text-sm font-semibold">{m.n}</div>
                    <div className="text-xs text-muted-foreground">{m.d}</div>
                  </div>
                  <button className="rounded-full bg-background px-3 py-1 text-xs font-medium">Taken</button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Upcoming</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {[
                { t: "Dr. Reyes · Cardiology", d: "Apr 22 · 10:30 AM" },
                { t: "Annual blood panel", d: "May 04 · 8:00 AM" },
              ].map((a) => (
                <li key={a.t} className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <div>
                    <div className="text-sm font-semibold">{a.t}</div>
                    <div className="text-xs text-muted-foreground">{a.d}</div>
                  </div>
                  <span className="text-xs font-medium text-primary">Details →</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-border bg-card p-7 shadow-card">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Recent labs</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {[
                { t: "Lipid panel", d: "Within range", v: "Mar 18" },
                { t: "HbA1c", d: "5.4% · normal", v: "Feb 02" },
              ].map((a) => (
                <li key={a.t} className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <div>
                    <div className="text-sm font-semibold">{a.t}</div>
                    <div className="text-xs text-muted-foreground">{a.d}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.v}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
