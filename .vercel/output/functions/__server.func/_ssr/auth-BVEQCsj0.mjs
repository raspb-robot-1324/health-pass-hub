import { K as reactExports, j as jsxRuntimeExports } from "./index.mjs";
import { u as useNavigate, L as Link } from "./router-HKvR8TqD.mjs";
import { s as supabase } from "./client-BDew0MgD.mjs";
import { m as motion, L as LoaderCircle, c as createLucideIcon } from "./loader-circle-DRxNDF7p.mjs";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode);
function AuthPage() {
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) navigate({
        to: "/dashboard"
      });
    });
  }, [navigate]);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const {
          error: error2
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: name || email.split("@")[0]
            }
          }
        });
        if (error2) throw error2;
        navigate({
          to: "/dashboard"
        });
      } else {
        const {
          error: error2
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error2) throw error2;
        navigate({
          to: "/dashboard"
        });
      }
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden bg-gradient-hero grain", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-lines opacity-40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto flex min-h-screen max-w-6xl items-center px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid w-full gap-16 md:grid-cols-2 md:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary", children: "// Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 font-display text-6xl leading-[1] tracking-tight md:text-7xl", children: mode === "signin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Welcome ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "back." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Begin your ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Novera." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-md text-muted-foreground", children: mode === "signin" ? "Sign in to your dashboard, passport and QR key." : "Create a free account. Your data is encrypted and only ever yours." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: [
            "Or keep exploring as the demo patient — ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "underline text-foreground", children: "enter dashboard" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.form, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, onSubmit: submit, className: "rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-xl shadow-elegant", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 rounded-full bg-secondary p-1 text-sm", children: ["signin", "signup"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode(m), className: `flex-1 rounded-full py-2 transition ${mode === m ? "bg-background text-foreground" : "text-muted-foreground"}`, children: m === "signin" ? "Sign in" : "Create account" }, m)) }),
          mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: name, onChange: (e) => setName(e.target.value), className: "input-base", placeholder: "Alex Morgan" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "input-base", placeholder: "you@example.com" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "password", value: password, onChange: (e) => setPassword(e.target.value), minLength: 6, className: "input-base", placeholder: "••••••••" }) }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-xl border border-emergency/40 bg-emergency/10 p-3 text-sm text-emergency", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: loading, className: "mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground transition disabled:opacity-50", children: [
            loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            mode === "signin" ? "Sign in" : "Create account"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .input-base { width:100%; height:44px; border-radius:9999px; border:1px solid var(--border); background:var(--background); padding:0 1rem; font-size:14px; outline:none; transition:border-color .2s; }
        .input-base:focus { border-color: var(--primary); }
      ` })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mt-5 block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: label }),
    children
  ] });
}
export {
  AuthPage as component
};
