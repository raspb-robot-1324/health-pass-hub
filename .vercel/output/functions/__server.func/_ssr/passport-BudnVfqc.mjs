import { K as reactExports, j as jsxRuntimeExports } from "./index.mjs";
import { L as Link } from "./router-HKvR8TqD.mjs";
import { S as SiteHeader } from "./SiteHeader-DGkoj4wZ.mjs";
import { g as getActiveProfile, a as getMedicalBundle } from "./medical-DS-NoB1C.mjs";
import { L as LoaderCircle, m as motion, c as createLucideIcon } from "./loader-circle-DRxNDF7p.mjs";
import { D as Download } from "./download-Dk1GecuV.mjs";
import { T as TriangleAlert, H as HeartPulse } from "./triangle-alert-Cq9lt5tz.mjs";
import { D as Droplet, P as Phone } from "./phone-oD59cBGq.mjs";
import { P as Pill } from "./pill-BCxH09Ss.mjs";
import { S as ShieldCheck } from "./shield-check-CU9PGFDO.mjs";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./client-BDew0MgD.mjs";
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
function Passport() {
  const [profile, setProfile] = reactExports.useState(null);
  const [meds, setMeds] = reactExports.useState([]);
  const [allergies, setAllergies] = reactExports.useState([]);
  const [conditions, setConditions] = reactExports.useState([]);
  const [contacts, setContacts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    (async () => {
      const p = await getActiveProfile();
      setProfile(p);
      if (p) {
        const b = await getMedicalBundle(p.id);
        setMeds(b.medications);
        setAllergies(b.allergies);
        setConditions(b.conditions);
        setContacts(b.contacts);
      }
      setLoading(false);
    })();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })
    ] });
  }
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen items-center justify-center text-muted-foreground gap-2 flex-col", children: [
        "No profile found. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "text-primary underline", children: "Sign in" })
      ] })
    ] });
  }
  const nameParts = profile.full_name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  const dateFormatted = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  }).replace(/\//g, ".");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media print {
          body * { visibility: hidden; }
          .print-doc, .print-doc * { visibility: visible; }
          .print-doc { position: absolute; left: 0; top: 0; width: 100%; transform: none !important; margin: 0; padding: 2rem !important; }
          header, .no-print { display: none !important; }
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "print-doc mx-auto max-w-5xl px-6 pt-32 pb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between no-print mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => window.print(), className: "group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:border-primary hover:text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        " Download Key (Fridge)"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "border-b border-border pb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-emergency", children: "// Emergency Passport" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-3 font-display text-7xl leading-[1] tracking-tight md:text-8xl", children: [
          firstName,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lastName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Age ",
            profile.age ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: profile.sex ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: profile.city ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Novera #",
            profile.pulseid_code ?? "—"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.98
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        delay: 0.1
      }, className: "mt-10 overflow-hidden rounded-3xl border-2 border-emergency bg-emergency/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-emergency px-6 py-3 text-emergency-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
            " Show to medical personnel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs", children: [
            "verified · ",
            dateFormatted
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-px bg-border md:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: Droplet, label: "Blood type", value: profile.blood_type ?? "—", big: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: HeartPulse, label: "Conditions", value: conditions.length > 0 ? conditions.map((c) => c.name).join(" · ") : "None", big: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: Pill, label: "Allergies", value: allergies.length > 0 ? allergies.map((a) => a.name).join(" · ") : "None known", big: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: 0.2
        }, className: "md:col-span-7 rounded-3xl border border-border bg-card p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: "// Current medications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-5 divide-y divide-border", children: [
            meds.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-baseline justify-between py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: String(i + 1).padStart(2, "0") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl", children: m.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-right", children: [
                m.dose,
                " ",
                m.schedule ? `· ${m.schedule}` : ""
              ] })
            ] }, m.id)),
            meds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "py-4 text-sm text-muted-foreground", children: "No active medications." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: 0.3
        }, className: "md:col-span-5 rounded-3xl border border-border bg-card p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3" }),
            " Emergency contacts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-5 space-y-4", children: [
            contacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-2xl border border-border p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${c.phone}`, className: "inline-flex h-9 w-9 items-center justify-center rounded-full bg-emergency text-emergency-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: [
                c.relation ?? "Contact",
                " · ",
                c.phone
              ] })
            ] }, c.id)),
            contacts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-sm text-muted-foreground py-2", children: "No emergency contacts listed." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, transition: {
        delay: 0.5
      }, className: "mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-success" }),
          " Encrypted · only public fields shown"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Last verified · ",
          dateFormatted
        ] })
      ] })
    ] })
  ] });
}
function Field({
  icon: Icon,
  label,
  value,
  big
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background p-7", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-emergency" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-4 font-display tracking-tight ${big ? "text-5xl md:text-6xl" : "text-3xl"}`, children: value })
  ] });
}
export {
  Passport as component
};
