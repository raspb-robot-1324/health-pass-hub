import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Lock, RefreshCw, Share2, ArrowUpRight, Loader2, Contact, Link as LinkIcon, AlertCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { getActiveProfile, getMedicalBundle, type Profile, type Medication, type Allergy, type Condition, type Contact as EmergencyContact } from "@/lib/medical";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Key — Pulseid" },
      { name: "description", content: "Generate a secure, revocable QR key." },
    ],
  }),
  component: QRPage,
});

type MedicalBundle = {
  medications: Medication[];
  allergies: Allergy[];
  conditions: Condition[];
  contacts: EmergencyContact[];
};

function QRPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bundle, setBundle] = useState<MedicalBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [qrMode, setQrMode] = useState<"link" | "vcard">("link");

  useEffect(() => {
    (async () => {
      const p = await getActiveProfile();
      setProfile(p);
      if (p) {
        const b = await getMedicalBundle(p.id);
        setBundle(b);
      }
      setLoading(false);
    })();
  }, []);

  const handleRotate = async () => {
    if (!profile) return;
    setRotating(true);
    try {
      const newCode = 'p-' + crypto.randomUUID().split('-')[0];
      await supabase.from("profiles").update({ pulseid_code: newCode }).eq("id", profile.id);
      setProfile({ ...profile, pulseid_code: newCode });
    } catch (e) {
      console.error(e);
    } finally {
      setRotating(false);
    }
  };

  const generateVCard = () => {
    if (!profile || !bundle) return "";
    
    // vCard 3.0 Standard
    const contactStr = bundle.contacts.map(c => `${c.name} (${c.relation ?? "Contact"}): ${c.phone}`).join("; ");
    const allergyStr = bundle.allergies.map(a => a.name).join(", ");
    const conditionStr = bundle.conditions.map(c => c.name).join(", ");
    const medsStr = bundle.medications.map(m => m.name).join(", ");

    const note = `[EMERGENCY CONTACTS] ${contactStr} | [ALLERGIES] ${allergyStr || "None recorded"} | [CONDITIONS] ${conditionStr || "None recorded"} | [MEDS] ${medsStr || "None recorded"}`;

    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.full_name}`,
      `N:;${profile.full_name};;;`,
      bundle.contacts[0] ? `TEL;TYPE=CELL:${bundle.contacts[0].phone}` : "",
      `NOTE:${note.substring(0, 255)}`, // most scanners have a limit
      "END:VCARD"
    ].filter(Boolean).join("\n");
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-screen items-center justify-center text-muted-foreground gap-2 flex-col">
          No profile found. <Link to="/auth" className="text-primary underline">Sign in</Link>
        </div>
      </div>
    );
  }

  const profileUrl = `https://pulseid.health/p/${profile.pulseid_code ?? "ax-m72k"}`;
  const qrValue = qrMode === "link" ? profileUrl : generateVCard();
  const displayId = profile.pulseid_code ?? "—";

  const allergyStr = bundle?.allergies?.map(a => a.name).join(", ") || "None";
  const conditionStr = bundle?.conditions?.map(c => c.name).join(", ") || "None";
  const contactStr = bundle?.contacts?.[0] ? `${bundle.contacts[0].name}: ${bundle.contacts[0].phone}` : "—";
  
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-16">
      <SiteHeader />

      {/* ── WALLET PRINT TEMPLATE ───────────────────────────────── */}
      <div id="wallet-print" className="hidden print:block">
        <div style={{
          width: "3.37in", height: "2.13in",
          border: "1px dashed #ccc",
          borderRadius: "12px",
          overflow: "hidden",
          fontFamily: "-apple-system, 'Inter', system-ui, sans-serif",
          color: "#0f172a",
          display: "flex",
          position: "fixed",
          top: "0.5in", left: "0.5in",
        }}>
          {/* LEFT SIDE — Info */}
          <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3l2-7 4 14 2-7h7" /></svg>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7c3aed" }}>PULSEID</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, marginTop: 4 }}>{profile.full_name}</div>
              <div style={{ fontSize: 8, color: "#64748b", marginTop: 2, letterSpacing: "0.05em" }}>ID: {displayId}</div>
            </div>
            <div style={{ fontSize: 8, lineHeight: 1.6, color: "#334155" }}>
              <div><b style={{color: "#dc2626"}}>⚠ Blood:</b> {profile.blood_type ?? "—"}</div>
              <div><b style={{color: "#dc2626"}}>⚠ Allergies:</b> {allergyStr}</div>
              <div><b>Conditions:</b> {conditionStr}</div>
              <div><b>Emergency:</b> {contactStr}</div>
            </div>
            <div style={{ fontSize: 6.5, color: "#94a3b8", borderTop: "1px solid #e2e8f0", paddingTop: 4 }}>
              pulseid.health/p/{displayId}
            </div>
          </div>
          {/* RIGHT SIDE — QR */}
          <div style={{ width: "1.3in", background: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 10 }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: 6 }}>
              <QRCodeSVG value={qrValue} size={100} level="M" bgColor="#fff" fgColor="#000" />
            </div>
            <div style={{ fontSize: 7, color: "#94a3b8", marginTop: 6, textAlign: "center", letterSpacing: "0.05em" }}>SCAN FOR<br/>FULL PROFILE</div>
          </div>
        </div>
        {/* CROP MARKS */}
        <div style={{ position: "fixed", top: "0.35in", left: "0.5in", width: "3.37in", borderTop: "1px dashed #ccc" }} />
        <div style={{ position: "fixed", top: "0.5in", left: "0.35in", height: "2.13in", borderLeft: "1px dashed #ccc" }} />
        <div style={{ position: "fixed", top: `calc(0.5in + 2.13in + 0.15in)`, left: "0.5in", width: "3.37in", borderTop: "1px dashed #ccc" }} />
        <div style={{ position: "fixed", top: "0.5in", left: `calc(0.5in + 3.37in + 0.15in)`, height: "2.13in", borderLeft: "1px dashed #ccc" }} />
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #wallet-print, #wallet-print * { visibility: visible !important; display: block !important; }
          #wallet-print { display: block !important; }
          .no-print, header, nav { display: none !important; }
          @page { size: auto; margin: 0; }
        }
      `}</style>

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="grid gap-16 md:grid-cols-12 md:items-start">
          {/* LEFT — copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-6"
          >
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// EMERGENCY KEY</div>
            <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight md:text-8xl text-balance">
              Your safety,
              <br />
              compressed in <span className="italic text-primary">one key.</span>
            </h1>
            <p className="mt-8 max-w-md text-muted-foreground text-lg leading-relaxed">
              Responders can scan this to see your live medical profile or instantly add your emergency data as a contact on their device.
            </p>

            <div className="mt-10 p-5 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-4 no-print">
               <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
               <div className="text-sm text-balance">
                 <span className="font-bold text-primary">Pro-tip:</span> Switch to <b>vCard Mode</b> before printing if you want responders to have your data offline even without cellular signal.
               </div>
            </div>

            <div className="mt-12 space-y-px overflow-hidden rounded-2xl border border-border">
              {[
                { icon: Lock, t: "Encrypted & revocable", d: "Disable in one tap from your dashboard." },
                { icon: RefreshCw, t: "Rotates on demand", d: "Generate a fresh code anytime." },
                { icon: Contact, t: "vCard Support", d: "Store life-saving data directly in contacts." },
              ].map((b) => (
                <div key={b.t} className="flex items-center gap-5 bg-card p-5 hover:bg-secondary/30 transition cursor-default">
                  <b.icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.4} />
                  <div className="flex-1">
                    <div className="font-display text-xl">{b.t}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{b.d}</div>
                  </div>
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
            {/* MODE TOGGLE */}
            <div className="flex p-1 bg-secondary/50 backdrop-blur-md rounded-full mb-6 max-w-fit mx-auto border border-border no-print">
               <button 
                  onClick={() => setQrMode("link")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition ${qrMode === 'link' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 <LinkIcon className="h-3 w-3" /> Profile Link
               </button>
               <button 
                  onClick={() => setQrMode("vcard")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition ${qrMode === 'vcard' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 <Contact className="h-3 w-3" /> vCard Mode
               </button>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 rounded-[3rem] bg-gradient-primary opacity-20 blur-3xl no-print" />
              <motion.div
                whileHover={{ rotate: 0.5, y: -4 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="print-card relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 shadow-elegant"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Pulseid · {qrMode === 'vcard' ? 'vCard Key' : 'Standard Key'}</div>
                    <div className="mt-2 font-display text-4xl leading-tight">{profile.full_name}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ID · {displayId}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full border border-success/40 bg-success/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-success leading-none">● Active</span>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                       {qrMode === 'link' ? <LinkIcon className="h-5 w-5 text-primary" /> : <Contact className="h-5 w-5 text-primary" />}
                    </div>
                  </div>
                </div>

                <div className="mt-10 rounded-3xl bg-foreground p-8">
                  <div className="rounded-2xl bg-white p-6 shadow-inner">
                    <QRCodeSVG
                      value={qrValue}
                      size={320}
                      level="Q"
                      bgColor="transparent"
                      fgColor="#000"
                      className="h-auto w-full"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {qrMode === 'link' ? `pulseid.health/p/${displayId}` : 'emergency contact payload'}
                  </div>
                  <div className="flex h-3 gap-1.5 items-end">
                    {[...Array(16)].map((_, i) => (
                      <span key={i} className="w-1 bg-primary/40 rounded-full" style={{ height: `${20 + Math.random() * 80}%` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 flex gap-4 no-print">
              <button onClick={handleDownload} className="group flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-foreground text-sm font-semibold text-background transition hover:bg-primary shadow-xl shadow-foreground/10 hover:shadow-primary/20">
                <Download className="h-5 w-5" /> Print Wallet Card
              </button>
              <button onClick={handleRotate} disabled={rotating} className="flex h-14 items-center justify-center gap-3 rounded-full border-2 border-border px-8 text-sm font-medium transition hover:border-primary hover:bg-primary/5 disabled:opacity-50">
                {rotating ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />} Rotate
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
