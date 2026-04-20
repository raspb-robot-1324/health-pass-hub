import { K as reactExports, j as jsxRuntimeExports } from "./index.mjs";
import { s as supabase } from "./client-BDew0MgD.mjs";
import { S as SiteHeader } from "./SiteHeader-DGkoj4wZ.mjs";
import { b as Route2 } from "./router-HKvR8TqD.mjs";
import { L as LoaderCircle } from "./loader-circle-DRxNDF7p.mjs";
import { T as TriangleAlert, H as HeartPulse } from "./triangle-alert-Cq9lt5tz.mjs";
import { D as Droplet, P as Phone } from "./phone-oD59cBGq.mjs";
import { P as Pill } from "./pill-BCxH09Ss.mjs";
import { S as ShieldCheck } from "./shield-check-CU9PGFDO.mjs";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function ResponderView() {
  const {
    id
  } = Route2.useParams();
  const search = Route2.useSearch();
  const isResponder = search.responder === "1";
  const [profile, setProfile] = reactExports.useState(null);
  const [meds, setMeds] = reactExports.useState([]);
  const [allergies, setAllergies] = reactExports.useState([]);
  const [conditions, setConditions] = reactExports.useState([]);
  const [contacts, setContacts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: p
      } = await supabase.from("profiles").select("*").eq("pulseid_code", id).maybeSingle();
      if (p) {
        setProfile(p);
        const [m, al, c, con] = await Promise.all([supabase.from("medications").select("*").eq("profile_id", p.id).order("created_at"), supabase.from("allergies").select("*").eq("profile_id", p.id), supabase.from("conditions").select("*").eq("profile_id", p.id), supabase.from("emergency_contacts").select("*").eq("profile_id", p.id)]);
        setMeds(m.data || []);
        setAllergies(al.data || []);
        setConditions(c.data || []);
        setContacts(con.data || []);
      }
      setLoading(false);
    })();
  }, [id]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) })
    ] });
  }
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center text-muted-foreground", children: "Profile not found or access revoked." })
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `min-h-screen ${isResponder ? "bg-[#0f0000]" : "bg-background"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-5xl px-6 pt-32 pb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border-b ${isResponder ? "border-emergency/30" : "border-border"} pb-8`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-emergency flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
          isResponder ? "CRITICAL EMERGENCY VIEW · RESPONDER_MODE_ACTIVE" : "// Public Medical Key"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: `mt-3 font-display leading-[1] tracking-tight ${isResponder ? "text-[clamp(4rem,12vw,10rem)] text-white" : "text-7xl md:text-8xl"}`, children: [
          firstName,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lastName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Age ",
            profile.age ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isResponder ? "text-white font-bold" : "", children: profile.sex ?? "—" }),
          profile.ramq_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary tracking-widest", children: [
            "RAMQ: ",
            profile.ramq_number
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Novera #",
            profile.pulseid_code
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid gap-px bg-emergency/20 border border-emergency/30 rounded-3xl overflow-hidden md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: Droplet, label: "Blood type", value: profile.blood_type ?? "—", emergency: isResponder }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: HeartPulse, label: "Conditions", value: conditions.length > 0 ? conditions.map((c) => c.name).join(" · ") : "None", emergency: isResponder }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: Pill, label: "Allergies", value: allergies.length > 0 ? allergies.map((a) => a.name).join(" · ") : "None known", emergency: isResponder })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `md:col-span-7 rounded-3xl border ${isResponder ? "border-emergency/20 bg-black/40 text-white" : "border-border bg-card"} p-8`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: "// Current medications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: `mt-5 divide-y ${isResponder ? "divide-emergency/20" : "divide-border"}`, children: [
            meds.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-baseline justify-between py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: String(i + 1).padStart(2, "0") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-display ${isResponder ? "text-3xl font-bold" : "text-2xl"}`, children: m.name })
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `md:col-span-5 rounded-3xl border ${isResponder ? "border-emergency/20 bg-black/40 text-white" : "border-border bg-card"} p-8`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3 text-emergency" }),
            " Emergency contacts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-5 space-y-4", children: [
            contacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `rounded-2xl border ${isResponder ? "border-emergency/30" : "border-border"} p-4`, children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex items-center justify-between border-t border-border/30 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-success" }),
          " Read Only Authenticated"
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
  emergency
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-7 ${emergency ? "bg-black/80 text-white" : "bg-background"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-emergency animate-pulse" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-4 font-display tracking-tight ${emergency ? "text-6xl md:text-7xl font-bold" : "text-4xl md:text-5xl"}`, children: value })
  ] });
}
export {
  ResponderView as component
};
