import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Novera" },
      { name: "description", content: "Create your Novera account or sign in." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero grain">
      <div className="absolute inset-0 grid-lines opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6">
        <Link to="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="grid w-full gap-16 md:grid-cols-2 md:items-center">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// Account</div>
            <h1 className="mt-4 font-display text-6xl leading-[1] tracking-tight md:text-7xl">
              {mode === "signin" ? <>Welcome <span className="text-primary">back.</span></> : <>Begin your <span className="text-primary">Novera.</span></>}
            </h1>
            <p className="mt-6 max-w-md text-muted-foreground">
              {mode === "signin"
                ? "Sign in to your dashboard, passport and QR key."
                : "Create a free account. Your data is encrypted and only ever yours."}
            </p>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Or keep exploring as the demo patient — <Link to="/dashboard" className="underline text-foreground">enter dashboard</Link>
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-xl shadow-elegant"
          >
            <div className="flex gap-2 rounded-full bg-secondary p-1 text-sm">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-full py-2 transition ${mode === m ? "bg-background text-foreground" : "text-muted-foreground"}`}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            {mode === "signup" && (
              <Field label="Full name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-base"
                  placeholder="Alex Morgan"
                />
              </Field>
            )}
            <Field label="Email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password">
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="input-base"
                placeholder="••••••••"
              />
            </Field>

            {error && <div className="mt-4 rounded-xl border border-emergency/40 bg-emergency/10 p-3 text-sm text-emergency">{error}</div>}

            <button
              disabled={loading}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground transition disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </motion.form>
        </div>
      </div>

      <style>{`
        .input-base { width:100%; height:44px; border-radius:9999px; border:1px solid var(--border); background:var(--background); padding:0 1rem; font-size:14px; outline:none; transition:border-color .2s; }
        .input-base:focus { border-color: var(--primary); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-5 block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
