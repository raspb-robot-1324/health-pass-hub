import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(1200px,calc(100%-2rem))]"
    >
      <div className="flex items-center justify-between rounded-full border border-border/60 bg-background/60 px-3 py-2 backdrop-blur-2xl shadow-card">
        <Link to="/" className="flex items-center gap-2.5 pl-2">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-60" />
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h3l2-7 4 14 2-7h7" />
              </svg>
            </div>
          </div>
          <span className="font-display text-xl tracking-tight">Pulse<span className="italic text-primary">id</span></span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { to: "/dashboard", l: "Dashboard" },
            { to: "/passport", l: "Passport" },
            { to: "/qr", l: "QR Key" },
          ].map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className="rounded-full px-4 py-1.5 text-sm text-muted-foreground transition hover:text-foreground hover:bg-secondary"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {i.l}
            </Link>
          ))}
        </nav>
        {authed ? (
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:bg-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Sign out
          </button>
        ) : (
          <Link
            to="/auth"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:bg-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary group-hover:bg-background animate-pulse" />
            Sign in
          </Link>
        )}
      </div>
    </motion.header>
  );
}
