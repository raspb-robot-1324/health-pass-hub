import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Droplet, QrCode, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function InteractiveDemo() {
  const [name, setName] = useState("Jane Doe");
  const [bloodType, setBloodType] = useState("A+");
  const [allergy, setAllergy] = useState("Penicillin");
  const [severity, setSeverity] = useState("SEVERE");

  const [activeTab, setActiveTab] = useState("card");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-start gap-2">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" /> Interactive Demo
        </div>
      </div>
      <div>
        <h2 className="font-display text-5xl leading-[1] tracking-tight md:text-6xl">Try it <span className="italic text-primary">yourself.</span></h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Edit a sample profile and watch your emergency card update in real-time. No sign-up needed.
        </p>
      </div>

      <div className="mt-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
          <Tabs.List className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card p-1">
            <Tabs.Trigger value="card" className="rounded-full px-5 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground">
              Emergency Card
            </Tabs.Trigger>
            <Tabs.Trigger value="qr" className="rounded-full px-5 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground">
              QR Code
            </Tabs.Trigger>
            <Tabs.Trigger value="ai" className="rounded-full px-5 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground">
              AI Analysis
            </Tabs.Trigger>
          </Tabs.List>

          <div className="mt-8 flex flex-col items-stretch overflow-hidden rounded-[2.5rem] border border-border bg-card md:flex-row shadow-elegant">
            
            {/* LEFT PANE - CONTROLS */}
            <div className="flex-[0.8] p-8 md:p-10 border-b md:border-b-0 md:border-r border-border">
              <div className="space-y-6">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Blood Type</label>
                  <input value={bloodType} onChange={e => setBloodType(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Primary Allergy</label>
                  <input value={allergy} onChange={e => setAllergy(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Severity</label>
                  <div className="flex gap-2">
                    {["MILD", "MODERATE", "SEVERE"].map(sev => (
                      <button 
                        key={sev}
                        onClick={() => setSeverity(sev)}
                        className={`flex-1 rounded-xl border px-3 py-3 text-xs font-medium transition ${severity === sev ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-muted-foreground'}`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANE - OUTPUT */}
            <div className="flex-[1.2] bg-background/50 p-8 md:p-12 flex items-center justify-center relative min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === "card" && (
                  <motion.div 
                    key="card"
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-sm rounded-[2rem] border border-border bg-card shadow-elegant overflow-hidden"
                  >
                    <div className="bg-[#1e293b] p-6 text-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-[#93c5fd]" />
                        <div>
                          <div className="font-display text-2xl truncate w-32">{name || "Name"}</div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#94a3b8] truncate">Pulseid Emergency</div>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-[#f59e0b] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {bloodType || "?"}
                      </div>
                    </div>
                    
                    {allergy && (
                      <div className="bg-emergency/10 p-5 border-b border-border">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emergency mb-1">Alert</div>
                        <div className="font-medium text-emergency text-sm">{allergy} — {severity}</div>
                      </div>
                    )}
                    
                    <div className="p-6 space-y-5">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Medications</div>
                        <div className="text-sm">Metformin <span className="text-muted-foreground text-xs ml-2">500mg</span></div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Conditions</div>
                        <div className="text-sm">Type 2 Diabetes <span className="text-muted-foreground text-xs ml-2">Since 2018</span></div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Contacts</div>
                        <div className="text-sm">Emergency <span className="text-muted-foreground text-xs ml-2">John Doe · 514-555-0100</span></div>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 p-4 border-t border-border flex justify-between items-center text-[9px] font-mono text-muted-foreground uppercase">
                       <span>Self-reported by patient.</span>
                       <span>ID: {name.substring(0,2).toUpperCase()}18</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === "qr" && (
                   <motion.div 
                    key="qr"
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-sm rounded-[2rem] border border-border bg-card p-10 text-center shadow-elegant relative"
                  >
                    <QrCode className="h-6 w-6 text-primary absolute top-6 left-6" />
                    <div className="mt-8 rounded-2xl bg-foreground p-6 inline-block">
                      <div className="rounded-xl bg-background p-4">
                        <QRCodeSVG value="https://pulseid.health/demo" size={180} level="H" bgColor="transparent" fgColor="oklch(0.97 0.01 220)" className="h-auto" />
                      </div>
                    </div>
                    <div className="mt-6 font-display text-2xl truncate">{name || "Scan to view"}</div>
                    <div className="text-xs text-muted-foreground mt-2">Scan anywhere to open the emergency card. It's revocable from your dashboard.</div>
                  </motion.div>
                )}

                {activeTab === "ai" && (
                   <motion.div 
                    key="ai"
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-sm rounded-[2rem] border border-border bg-card p-8 shadow-elegant"
                  >
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">
                      <Sparkles className="h-4 w-4" /> AI Diagnostics Prep
                    </div>
                    <div className="prose prose-sm prose-invert text-muted-foreground">
                      <p className="text-foreground"><strong>Patient:</strong> {name}</p>
                      <p><strong>Primary Flags:</strong> Known {allergy} allergy ({severity}). Avoid all cross-reactive prescriptions. Blood type {bloodType} verified.</p>
                      <p>Patient currently manages Type 2 Diabetes via Metformin (500mg).</p>
                      <p><em>Suggested Doctor Prep:</em> Monitor renal function before prescribing new contrast or nephrotoxic agents due to Metformin baseline.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}
