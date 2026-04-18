import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { Download, Lock, RefreshCw, Share2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "Secure QR Code — PulseID" },
      { name: "description", content: "Generate a secure, revocable QR code that surfaces your emergency passport instantly." },
      { property: "og:title", content: "Secure QR Code — PulseID" },
      { property: "og:description", content: "A scannable code for your emergency passport." },
    ],
  }),
  component: QRPage,
});

function QRPage() {
  const url = "https://pulseid.health/p/ax-m72k";
  return (
    <div className="min-h-screen bg-gradient-soft">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1fr_1fr]">
        <div>
          <div className="text-sm font-medium uppercase tracking-wider text-primary">Your secure code</div>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">Share what matters, instantly.</h1>
          <p className="mt-5 text-muted-foreground">
            Print it on your wallet card, attach it to a wristband, or stick it inside your phone case. Scanning opens your emergency passport — nothing more.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: Lock, t: "Encrypted & revocable", d: "Disable access anytime from your dashboard." },
              { icon: RefreshCw, t: "Rotates on demand", d: "Generate a new code in one tap." },
              { icon: Share2, t: "Granular sharing", d: "Choose exactly which fields are visible." },
            ].map((b) => (
              <div key={b.t} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
                  <b.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{b.t}</div>
                  <div className="text-xs text-muted-foreground">{b.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-primary opacity-30 blur-2xl" />
            <div className="relative rounded-[2rem] border border-border bg-card p-8 shadow-elegant">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">PulseID</div>
                  <div className="font-display text-base font-semibold">Alex Morgan</div>
                </div>
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">Active</span>
              </div>
              <div className="rounded-2xl bg-background p-5">
                <QRCodeSVG
                  value={url}
                  size={256}
                  level="H"
                  bgColor="transparent"
                  fgColor="oklch(0.32 0.11 245)"
                />
              </div>
              <div className="mt-5 break-all text-center text-xs text-muted-foreground">{url}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-elegant">
              <Download className="h-4 w-4" /> Download PNG
            </button>
            <button className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold">
              <RefreshCw className="h-4 w-4" /> Rotate code
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
