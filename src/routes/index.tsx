import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowUpRight, ShieldCheck, QrCode, Activity, HeartPulse, Lock, Plus, Sparkles, Loader2, MapPin, Zap, Globe, FileText, Smartphone, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroOrb } from "@/components/HeroOrb";
import { EcgLine } from "@/components/EcgLine";
import { getActiveProfile, getMedicalBundle, callMedicalAI, type Profile, type Medication, type Allergy, type Condition } from "@/lib/medical";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { useTranslation } from "react-i18next";
import { SupportModal } from "@/components/SupportModal";
import { WaitlistModal } from "@/components/WaitlistModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulseid — Your medical life, in one signal" },
      { name: "description", content: "A medical OS for Quebec: live dashboard, emergency passport, secure QR key, and AI guidance." },
      { property: "og:title", content: "Pulseid" },
      { property: "og:description", content: "Medical dashboard, emergency passport, secure QR key." },
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
  const { t } = useTranslation();
  const [supportOpen, setSupportOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const missionRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // GSAP scroll animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Mission section — slide up with parallax
      if (missionRef.current) {
        gsap.from(missionRef.current.querySelectorAll(".gsap-reveal"), {
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
            end: "bottom 50%",
            toggleActions: "play none none none",
          },
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        });
      }

      // Bento grid — 3D card reveals
      if (bentoRef.current) {
        gsap.from(bentoRef.current.querySelectorAll(".bento-card"), {
          scrollTrigger: {
            trigger: bentoRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 80,
          opacity: 0,
          rotateX: 8,
          scale: 0.95,
          duration: 0.9,
          stagger: 0.1,
          ease: "power2.out",
          transformOrigin: "bottom center",
        });
      }

      // Stats — counter-reveal
      if (statsRef.current) {
        gsap.from(statsRef.current.querySelectorAll(".stat-card"), {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          stagger: 0.12,
          ease: "back.out(1.7)",
        });
      }

      // Manifesto — word reveal
      if (manifestoRef.current) {
        gsap.from(manifestoRef.current.querySelectorAll(".word"), {
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          y: 30,
          opacity: 0,
          filter: "blur(8px)",
          duration: 0.6,
          stagger: 0.04,
          ease: "power2.out",
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    (async () => {
      const p = await getActiveProfile();
      setProfile(p);
      if (p) {
        const b = await getMedicalBundle(p.id);
        setMeds(b.medications);
        setAllergies(b.allergies);
        setConditions(b.conditions);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-gradient-hero grain">
        <div className="absolute inset-0 grid-lines opacity-60" />
        <motion.div style={{ y: orbY, scale: orbScale }} className="absolute inset-0 z-0">
          <HeroOrb />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="absolute right-12 top-32 z-20 hidden xl:block pointer-events-none">
          <div className="animate-float rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-card w-56">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live signal
            </div>
            <div className="mt-2 font-display text-3xl">72<span className="text-base text-muted-foreground"> bpm</span></div>
            <EcgLine className="mt-1 h-8 w-full text-success" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="absolute left-12 bottom-32 z-20 hidden xl:block pointer-events-none">
          <div className="animate-float rounded-2xl border border-emergency/40 bg-emergency/10 p-4 backdrop-blur-xl w-64" style={{ animationDelay: "2s" }}>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-emergency">
              <ShieldCheck className="h-3.5 w-3.5" /> Emergency passport
            </div>
            <div className="mt-2 font-display text-xl leading-tight">O+ · Penicillin · Asthma</div>
          </div>
        </motion.div>

        <motion.div style={{ y: titleY }} className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-12 bg-primary" /> A medical operating system · Québec, 2026
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(3rem,10vw,9rem)] leading-[0.92] tracking-tight">
            <SplitLine delay={0.3}>{t("heroTitle1")}</SplitLine>
            <SplitLine delay={0.5}>{t("heroTitle2")}&nbsp;<span className="italic text-primary">{t("heroTitle3")}</span></SplitLine>
          </h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/dashboard" className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-foreground pl-8 pr-2 text-base font-medium text-background transition hover:bg-primary">
                {t("enterPlatform")}
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <button onClick={() => setWaitlistOpen(true)} className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border px-8 text-base font-medium transition hover:border-primary hover:text-primary">
                {t("waitlistButton")}
              </button>
              <button onClick={() => setSupportOpen(true)} className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary/10 text-primary border border-primary/20 px-8 text-base font-medium transition hover:bg-primary/20">
                <HeartPulse className="h-4 w-4" />
                {t("supportButton")}
              </button>
            </div>
          </motion.div>
        </motion.div>
        <SupportModal open={supportOpen} onOpenChange={setSupportOpen} />
        <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />

        <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <div>Montréal · QC</div>
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
                  {w}<Plus className="h-6 w-6 text-primary" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section ref={missionRef} className="relative mx-auto max-w-7xl px-6 py-32" style={{ perspective: "1200px" }}>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4 gsap-reveal">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// 01 — Mission</div>
          </div>
          <div className="md:col-span-8">
            <h2 className="gsap-reveal font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
              Healthcare in Quebec is <span className="italic text-primary">brilliant</span> — but the data lives in <span className="italic">silos.</span>
            </h2>
            <p className="gsap-reveal mt-8 max-w-2xl text-lg text-muted-foreground">
              We believe your medical life shouldn't be scattered across paper folders, hospital portals, and a wallet card you might forget. Pulseid puts it in your pocket — encrypted, scannable, and actually useful. Built for the realities of CLSCs, Clic Santé and Info-Santé 811.
            </p>
            <div className="gsap-reveal mt-12 grid gap-6 border-t border-border pt-8 md:grid-cols-3">
              {[
                { v: "Patient-owned", l: "Your data, your keys, your call" },
                { v: "Quebec-first", l: "Wired to Clic Santé, RVSQ, 811" },
                { v: "Care-grade", l: "Built with clinicians, not for them" },
              ].map((x) => (
                <div key={x.v}>
                  <div className="font-display text-3xl tracking-tight text-primary">{x.v}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NOVERA MISSION BLOCK */}
        <div className="mt-32 border-t border-border pt-32 mx-auto max-w-5xl">
          <div className="mb-8 font-mono text-xs uppercase tracking-[0.3em] inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
             <HeartPulse className="h-4 w-4" /> OUR MISSION
          </div>
          <h3 className="font-display text-4xl leading-tight md:text-5xl lg:text-6xl max-w-4xl tracking-tight text-foreground">
             <span className="italic">Health information</span> that works when it matters most.
          </h3>
          
          <div className="mt-8 grid gap-8 md:grid-cols-2 text-lg text-muted-foreground leading-relaxed max-w-4xl">
            <p>
              Every year, preventable medical errors occur because first responders don't have the information they need at the critical moment. Allergies unknown. Medications undocumented. Emergency contacts unreachable. Pulseid exists to close that gap permanently, for everyone.
            </p>
            <p>
              We believe access to life-saving tools shouldn't depend on your income, your language, or your internet connection. Our mission is simple: give every person a universal medical profile that works offline, translates instantly, and is always in their pocket.
            </p>
          </div>

          <div ref={statsRef} className="mt-16 grid gap-4 sm:grid-cols-3">
             <div className="stat-card rounded-3xl bg-[#e0f2fe] p-8 text-[#0f172a]">
                <div className="font-display text-4xl mb-3">1 in 3</div>
                <div className="text-sm font-medium opacity-80">adults carry no documented emergency health info</div>
             </div>
             <div className="stat-card rounded-3xl bg-[#e0f2fe] p-8 text-[#0f172a]">
                <div className="font-display text-4xl mb-3">5-15 min</div>
                <div className="text-sm font-medium opacity-80">average delay when critical medical info can't be located</div>
             </div>
             <div className="stat-card rounded-3xl bg-[#e0f2fe] p-8 text-[#0f172a]">
                <div className="font-display text-4xl mb-3">50k-100k</div>
                <div className="text-sm font-medium opacity-80">lives that we could save in the US per year without this delay</div>
             </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-4">
             <div className="rounded-3xl border border-border bg-card p-6">
                <ShieldCheck className="h-5 w-5 text-primary mb-4" />
                <div className="font-display text-lg mb-2">Free, forever</div>
                <div className="text-xs text-muted-foreground leading-relaxed">Pulseid is funded by grants and community support — never advertising. Every feature, for every user, at zero cost.</div>
             </div>
             <div className="rounded-3xl border border-border bg-card p-6">
                <Zap className="h-5 w-5 text-success mb-4" />
                <div className="font-display text-lg mb-2">Offline-first</div>
                <div className="text-xs text-muted-foreground leading-relaxed">Your QR badge contains everything a responder needs — no server, no network, no barrier between them and the truth.</div>
             </div>
             <div className="rounded-3xl border border-border bg-card p-6">
                <Globe className="h-5 w-5 text-warning mb-4" />
                <div className="font-display text-lg mb-2">Built for equity</div>
                <div className="text-xs text-muted-foreground leading-relaxed">Multi-language support, accessible design, and zero data-selling make Pulseid a tool anyone can trust and actually use.</div>
             </div>
             <div className="rounded-3xl border border-border bg-card p-6">
                <Lock className="h-5 w-5 text-emergency mb-4" />
                <div className="font-display text-lg mb-2">Radical transparency</div>
                <div className="text-xs text-muted-foreground leading-relaxed">We publish our funding, our data practices, and our roadmap. Nothing is hidden, nothing is sold. We answer to patients, not investors.</div>
             </div>
          </div>
        </div>
      </section>

      {/* NOVERA BENTO GRID */}
      <section className="bg-[#e0f2fe] py-32 text-[#0f172a]">
        <div ref={bentoRef} className="mx-auto max-w-6xl px-6" style={{ perspective: "1200px" }}>
          <h2 className="font-display text-5xl leading-tight md:text-6xl mb-4 italic tracking-tight">Everything you need.</h2>
          <p className="text-lg opacity-80 mb-16">Designed to be useful when the stakes are highest.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 grid-rows-[auto_auto_auto_auto]">
             
             {/* Bento 1: QR Badge (Large Top Left) */}
             <div className="bento-card col-span-1 md:col-span-2 lg:col-span-3 row-span-2 rounded-[2.5rem] bg-white p-10 flex flex-col justify-end min-h-[360px] relative overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
                <div className="absolute top-10 left-10 h-14 w-14 rounded-2xl bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                   <QrCode className="h-6 w-6" />
                </div>
                <div className="relative z-10 w-4/5">
                   <h3 className="font-display text-3xl mb-3">Offline-first QR Badge</h3>
                   <p className="text-sm text-[#64748b] leading-relaxed mb-6">Generates standard vCards encoded directly into the QR matrix. First responders scan natively with any smartphone camera — no app, no network, no barrier.</p>
                   <span className="inline-flex items-center gap-2 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-medium text-[#16a34a]"><div className="h-1.5 w-1.5 rounded-full bg-[#16a34a]"></div> Works anywhere</span>
                </div>
             </div>

             {/* Bento 2: AI Analysis (Top Right Wide) */}
             <div className="bento-card col-span-1 md:col-span-2 lg:col-span-3 rounded-[2.5rem] bg-white p-10 shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col justify-center">
                <div className="h-12 w-12 rounded-2xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center mb-6">
                   <Activity className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl mb-2">AI Analysis</h3>
                <p className="text-sm text-[#64748b]">Gemini analyzes your drug interactions, allergy warnings, and travel considerations in plain language.</p>
             </div>

             {/* Bento 3: Private by Design (Middle Right Dark) */}
             <div className="bento-card col-span-1 md:col-span-2 lg:col-span-3 rounded-[2rem] bg-[#0f172a] text-white p-10 shadow-xl hover:shadow-2xl transition-shadow duration-500 flex flex-col justify-center">
                <div className="h-12 w-12 rounded-2xl bg-[#1e293b] text-[#60a5fa] flex items-center justify-center mb-6">
                   <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl mb-2">Private by design</h3>
                <p className="text-sm text-[#94a3b8]">Quebec Law 25 compliant. Your data belongs to you.</p>
             </div>

             {/* Bento 4: AI Translation (Bottom Left 2-col) */}
             <div className="bento-card col-span-1 md:col-span-2 rounded-[2.5rem] bg-white p-10 shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col justify-center">
                <div className="h-12 w-12 rounded-2xl bg-[#eff6ff] text-[#8b5cf6] flex items-center justify-center mb-6">
                   <Globe className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl mb-2">AI Translation</h3>
                <p className="text-sm text-[#64748b]">EN · FR · ES and more coming soon.</p>
             </div>

             {/* Bento 5: Printable PDF Card (Bottom Mid 2-col) */}
             <div className="col-span-1 md:col-span-2 lg:col-span-4 rounded-[2.5rem] bg-white p-10 shadow-sm flex flex-col justify-center">
                <div className="h-12 w-12 rounded-2xl bg-[#fefce8] text-[#eab308] flex items-center justify-center mb-6">
                   <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl mb-2">Printable PDF Card</h3>
                <p className="text-sm text-[#64748b]">Print a wallet-size card to keep in your bag or on your fridge.</p>
             </div>
             
             {/* Bento 6: Works Offline Dark (Bottom Left Wide) */}
             <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-start-4 rounded-[2.5rem] bg-[#0f172a] text-white p-10 shadow-xl flex flex-col justify-center">
                <div className="h-12 w-12 rounded-2xl bg-[#1e293b] text-[#10b981] flex items-center justify-center mb-6">
                   <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl mb-2">Works fully offline</h3>
                <p className="text-sm text-[#94a3b8]">All data is embedded in the QR — no server required in an emergency.</p>
             </div>

             {/* Bento 7: Blood Thinner Alerts Wide (Bottom Right Wide) */}
             <div className="col-span-1 md:col-span-4 lg:col-span-4 lg:row-start-4 rounded-[2.5rem] bg-white p-10 shadow-sm flex flex-col justify-center">
                <div className="h-12 w-12 rounded-2xl bg-[#fff7ed] text-[#f97316] flex items-center justify-center mb-6">
                   <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl mb-2">Blood thinner alerts</h3>
                <p className="text-sm text-[#64748b]">Warfarin, apixaban, rivaroxaban, dabigatran, and clopidogrel are auto-flagged on your card.</p>
             </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section className="relative mx-auto max-w-7xl px-6 pb-32 pt-16">
        <InteractiveDemo />
      </section>

      {/* TEAM */}
      <section className="relative mx-auto max-w-7xl px-6 py-32 border-t border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// 03 — The crew</div>
            <h2 className="mt-4 font-display text-5xl leading-[1] tracking-tight md:text-6xl">Three people, <span className="italic text-primary">one mission.</span></h2>
          </div>
          <div className="md:col-span-8 grid gap-4 sm:grid-cols-3">
            {[
              { name: "Firstname Lastname", role: "CEO · Product", bio: "Spent a decade designing health products. Believes interfaces save lives.", hue: 215, image: "/founders/one.png" },
              { name: "Firstname Lastname", role: "CTO · Engineering", bio: "Built distributed systems at scale. Now applying them to vitals.", hue: 250, image: "/founders/two.png" },
              { name: "Firstname Lastname", role: "MD · Clinical Lead", bio: "Practicing physician in Montréal. Knows where the seams are.", hue: 95, image: "/founders/three.png" },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl border border-border bg-card p-5"
              >
                <div className="aspect-square overflow-hidden rounded-2xl relative" style={{ background: `radial-gradient(circle at 30% 30%, oklch(0.6 0.18 ${m.hue}), oklch(0.2 0.04 240))` }}>
                  <img src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50 transition duration-500 group-hover:opacity-100 group-hover:scale-105" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className="absolute inset-0 flex h-full w-full items-end justify-start p-4 text-7xl font-display text-background/40 italic z-10 pointer-events-none">{m.name.split(" ")[0]?.[0]}</div>
                </div>
                <div className="mt-4 font-display text-2xl">{m.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{m.role}</div>
                <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section ref={manifestoRef} className="relative overflow-hidden bg-foreground py-32 text-background">
        <div className="absolute inset-0 grain opacity-30" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="word font-mono text-xs uppercase tracking-[0.3em] text-primary">// Manifesto</div>
          <p className="mt-8 font-display text-4xl leading-[1.15] tracking-tight md:text-6xl">
            {"Health data shouldn't sit in a portal you'll never visit. It should".split(" ").map((w, i) => <span key={i} className="word inline-block mr-[0.3em]">{w}</span>)}{" "}
            <span className="word italic text-primary inline-block mr-[0.3em]">travel with you</span>{" "}
            {"surface".split(" ").map((w, i) => <span key={`s${i}`} className="word inline-block mr-[0.3em]">{w}</span>)}{" "}
            <span className="word italic text-primary inline-block mr-[0.3em]">when you need it</span>{" "}
            {"and answer to".split(" ").map((w, i) => <span key={`a${i}`} className="word inline-block mr-[0.3em]">{w}</span>)}{" "}
            <span className="word italic text-primary inline-block">no one but you.</span>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7 md:col-start-2">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// Begin</div>
            <h2 className="mt-6 font-display text-6xl leading-[1] tracking-tight md:text-8xl">
              The clearest picture<br />of <span className="italic text-primary">your health,</span><br />when it counts.
            </h2>
          </div>
          <div className="md:col-span-3 md:col-start-10 space-y-4">
            <Link to="/dashboard" className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition hover:border-primary">
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
          <div>© 2026 Pulseid Health · Made in Montréal</div>
          <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> All systems nominal</div>
          <div>Connected to Clic Santé · RVSQ · 811</div>
        </div>
      </footer>
    </div>
  );
}

function SplitLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.span>
    </span>
  );
}

function QRPreview({ profile }: { profile: Profile | null }) {
  const url = `https://pulseid.health/p/${profile?.pulseid_code ?? "ax-m72k"}`;
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2"><QrCode className="h-4 w-4 text-primary" /><span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">QR key · live</span></div>
      <div className="mt-5 rounded-2xl bg-foreground p-4">
        <div className="rounded-xl bg-background p-4">
          <QRCodeSVG value={url} size={200} level="H" bgColor="transparent" fgColor="oklch(0.97 0.01 220)" className="h-auto w-full" />
        </div>
      </div>
      <div className="mt-4 font-display text-2xl leading-tight">{profile?.full_name ?? "—"}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">#{profile?.pulseid_code ?? "—"}</div>
      <Link to="/qr" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline">Open QR page <ArrowUpRight className="h-3 w-3" /></Link>
    </motion.div>
  );
}

// suppress unused import warning for Activity
void Activity;
