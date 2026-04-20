import { K as reactExports, j as jsxRuntimeExports } from "./index.mjs";
import { u as useNavigate, R as Route$4 } from "./router-HKvR8TqD.mjs";
import { s as supabase } from "./client-BDew0MgD.mjs";
import { g as getActiveProfile } from "./medical-DS-NoB1C.mjs";
import { L as LoaderCircle, m as motion } from "./loader-circle-DRxNDF7p.mjs";
import { S as ShieldCheck } from "./shield-check-CU9PGFDO.mjs";
import { A as Activity, a as AnimatePresence } from "./activity-CSdErVCA.mjs";
import { A as ArrowRight } from "./arrow-right-Dx04g7zO.mjs";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function OnboardingFlow() {
  const navigate = useNavigate({
    from: Route$4.id
  });
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [step, setStep] = reactExports.useState(1);
  const [age, setAge] = reactExports.useState("");
  const [bloodType, setBloodType] = reactExports.useState("");
  const [ramq, setRamq] = reactExports.useState("");
  const [sex, setSex] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  reactExports.useEffect(() => {
    (async () => {
      const p = await getActiveProfile();
      if (!p) {
        navigate({
          to: "/auth"
        });
        return;
      }
      if (p.is_demo) {
        navigate({
          to: "/"
        });
        return;
      }
      if (p.ramq_number && p.age && p.bloodType) ;
      setProfile(p);
      setAge(p.age?.toString() || "");
      setBloodType(p.blood_type || "");
      setRamq(p.ramq_number || "");
      setSex(p.sex || "");
      setCity(p.city || "");
      setLoading(false);
    })();
  }, [navigate]);
  const handleComplete = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await supabase.from("profiles").update({
        age: parseInt(age) || null,
        blood_type: bloodType,
        ramq_number: ramq,
        sex,
        city
      }).eq("id", profile.id);
      navigate({
        to: "/dashboard"
      });
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  const steps = [{
    num: 1,
    title: "Welcome to Novera",
    icon: ShieldCheck
  }, {
    num: 2,
    title: "Critical Details",
    icon: Activity
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex w-1/3 bg-card border-r border-border p-12 flex-col justify-between relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display tracking-tight text-3xl mb-12", children: "Novera." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: steps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-4 transition-opacity ${step === s.num ? "opacity-100" : "opacity-40"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 flex items-center justify-center rounded-xl border ${step === s.num ? "border-primary bg-primary/10 text-primary" : "border-border"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: [
              "Step 0",
              s.num
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl", children: s.title })
          ] })
        ] }, s.num)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-hero opacity-30 z-0 pointer-events-none" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col justify-center px-6 py-20 lg:px-24 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-xl mx-auto w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        x: 20
      }, animate: {
        opacity: 1,
        x: 0
      }, exit: {
        opacity: 0,
        x: -20
      }, className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary", children: "// Secure Initialization" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl leading-tight", children: [
          "Let's encrypt your ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "baseline health profile." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "Before we generate your revocable QR key, we need foundational information. This data is fully encrypted and never sold." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setStep(2), className: "inline-flex h-14 items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 text-base font-medium transition hover:bg-primary w-full sm:w-auto", children: [
          "Begin setup ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }, "step1"),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        x: 20
      }, animate: {
        opacity: 1,
        x: 0
      }, exit: {
        opacity: 0,
        x: -20
      }, className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl mb-2", children: "Critical Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Required by Quebec first responders during code triage." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2", children: "Age" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), placeholder: "e.g. 34", className: "w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2", children: "Biological Sex" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: sex, onChange: (e) => setSex(e.target.value), placeholder: "M / F / X", className: "w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2", children: "Blood Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: bloodType, onChange: (e) => setBloodType(e.target.value), placeholder: "e.g. O+", className: "w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2", children: "City" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: city, onChange: (e) => setCity(e.target.value), placeholder: "e.g. Montreal", className: "w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2", children: "RAMQ / Insurance Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: ramq, onChange: (e) => setRamq(e.target.value), placeholder: "ABCD 1234 5678", className: "w-full rounded-2xl border border-border bg-background px-5 py-4 text-base focus:border-primary focus:outline-none transition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-8 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), className: "text-sm font-medium text-muted-foreground hover:text-foreground", children: "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleComplete, disabled: saving || !ramq || !bloodType, className: "inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 text-base font-medium transition hover:opacity-90 disabled:opacity-50", children: [
            saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Complete Identity",
            " ",
            saving ? "" : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] })
      ] }, "step2")
    ] }) }) })
  ] });
}
export {
  OnboardingFlow as component
};
