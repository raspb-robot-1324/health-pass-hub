import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import myLogo from "@/assets/myLogo.png";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sun, Moon, Globe, LayoutDashboard, ShieldCheck, QrCode, LogOut, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useTranslation } from "react-i18next";
import { WaitlistModal } from "./WaitlistModal";

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const toggleLang = () => i18n.changeLanguage(i18n.language === "en" ? "fr" : "en");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const mobileNavItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/passport", icon: ShieldCheck, label: "Passport" },
    { to: "/qr", icon: QrCode, label: "QR Key" },
  ];

  // Shared CTA class — gradient, glow on hover, crisp focus ring.
  // Replaces the old flat bg-foreground sign-in style.
  const waitlistBtnClass =
    "group relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium " +
    "text-primary-foreground ml-2 overflow-hidden " +
    "bg-gradient-primary shadow-[0_0_0_0_oklch(0.78_0.16_215/0.0)] " +
    "transition-all duration-300 ease-out " +
    "hover:shadow-[0_0_24px_-4px_oklch(0.78_0.16_215/0.6)] hover:scale-[1.02] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <>
      {/* TOP BAR */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(1200px,calc(100%-2rem))]"
      >
        <div className="flex items-center justify-between rounded-full border border-border/60 bg-background/70 px-3 py-2 backdrop-blur-2xl shadow-card">
          <Link to="/" className="flex items-center gap-2.5 pl-2">
            <img src={myLogo} alt="Novera" className="h-7 w-auto" />
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

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleLang}
              aria-label="Toggle language"
              className="flex items-center gap-1 p-2 rounded-full text-xs font-mono font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="uppercase">{i18n.language}</span>
            </button>

            {authed ? (
              // Already signed in — keep sign out so existing users aren't locked out.
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition hover:bg-primary ml-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Sign out
              </button>
            ) : (
              // Pre-launch: sign-in is replaced by waitlist CTA.
              <button onClick={() => setWaitlistOpen(true)} className={waitlistBtnClass}>
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("waitlistButton")}</span>
                <span className="sm:hidden">Waitlist</span>
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="mx-2 mb-2 flex items-center justify-around rounded-2xl border border-border/60 bg-background/80 backdrop-blur-2xl shadow-card py-2 px-1">
          {mobileNavItems.map((item) => {
            const isActive = currentPath === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all ${
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "drop-shadow-[0_0_6px_oklch(0.7_0.2_270)]" : ""}`} />
                <span className="text-[10px] font-mono uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
          {authed ? (
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-muted-foreground hover:text-foreground transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-[10px] font-mono uppercase tracking-wider">Sign out</span>
            </button>
          ) : (
            <button
              onClick={() => setWaitlistOpen(true)}
              className="flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-primary hover:text-foreground transition-all"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-[10px] font-mono uppercase tracking-wider">Waitlist</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mounted here so it's available from every page the header appears on. */}
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </>
  );
}