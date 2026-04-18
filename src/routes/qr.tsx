import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Lock, RefreshCw, Share2, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Key — Pulseid" },
      { name: "description", content: "Generate a secure, revocable QR key." },
    ],
  }),
  component: QRPage,
});

function QRPage() {
  const url = "https://pulseid.health/p/ax-m72k";
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="grid gap-16 md:grid-cols-12 md:items-start">
          {/* LEFT — copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-6"
          >
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// QR Key</div>
            <h1 className="mt-3 font-display text-7xl leading-[0.95] tracking-tight md:text-8xl">
              A key
              <br />
              that's <span className="italic text-primary">only</span>
              <br />
              <span className="italic text-primary">yours.</span>
            </h1>
            <p className="mt-8 max-w-md text-muted-foreground">
              Print it on a wallet card. Engrave it on a wristband. Tape it inside your phone case. A scan opens your emergency passport — nothing more, nothing else.
            </p>

            <div className="mt-12 space-y-px overflow-hidden rounded-2xl border border-border">
              {[
                { icon: Lock, t: "Encrypted & revocable", d: "Disable in one tap from your dashboard." },
                { icon: RefreshCw, t: "Rotates on demand", d: "Generate a fresh code anytime." },
                { icon: Share2, t: "Granular sharing", d: "Decide which fields are visible." },
              ].map((b) => (
                <div key={b.t} className="flex items-center gap-5 bg-card p-5">
                  <b.icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.4} />
                  <div className="flex-1">
                    <div className="font-display text-xl">{b.t}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{b.d}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — QR card with 3D tilt feel */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-6 md:sticky md:top-32"
          >
            <div className="relative">
              <div className="absolute -inset-10 rounded-[3rem] bg-gradient-primary opacity-30 blur-3xl" />
              <motion.div
                whileHover={{ rotate: 1.5, y: -8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-elegant"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Pulseid · medical key</div>
                    <div className="mt-2 font-display text-3xl">Alex Morgan</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">id · ax-m72k</div>
                  </div>
                  <span className="rounded-full border border-success/40 bg-success/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-success">● Active</span>
                </div>

                <div className="mt-8 rounded-2xl bg-foreground p-6">
                  <div className="rounded-xl bg-background p-5">
                    <QRCodeSVG
                      value={url}
                      size={280}
                      level="H"
                      bgColor="transparent"
                      fgColor="oklch(0.97 0.01 220)"
                      className="h-auto w-full"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    pulseid.health/p/ax-m72k
                  </div>
                  <div className="flex h-2 gap-1">
                    {[...Array(12)].map((_, i) => (
                      <span key={i} className="w-px bg-primary" style={{ height: `${Math.random() * 100}%` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition hover:bg-primary">
                <Download className="h-4 w-4" /> Download
              </button>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm transition hover:border-primary">
                <RefreshCw className="h-4 w-4" /> Rotate
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
