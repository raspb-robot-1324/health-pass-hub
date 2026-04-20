import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sparkles, X, ChevronRight, Loader2, Check, AlertCircle, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { joinWaitlist } from "@/lib/waitlist-server";

type Status = "idle" | "loading" | "success" | "error";

// Very small client-side email check — real validation is server-side (RLS + table constraints).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const emailValid = EMAIL_RE.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const normalized = email.trim().toLowerCase();
      
      // Call the server function instead of direct client-side insert.
      // This bypasses browser-level network issues (CORS, Ad-blockers, etc).
      await joinWaitlist({
        data: {
          email: normalized,
          source: "site_header",
          locale: typeof navigator !== "undefined" ? navigator.language : null,
        }
      });

      setStatus("success");
    } catch (err) {
      console.error("Waitlist join error:", err);
      setStatus("error");
      setErrorMsg("Network error. Check your connection and try again.");
    }
  };

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      // Reset after close animation so users don't see state flicker on reopen.
      setTimeout(() => {
        setStatus("idle");
        setErrorMsg("");
        setEmail("");
      }, 250);
    }
  };

  const loading = status === "loading";
  const success = status === "success";
  const hasError = status === "error";

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-7 shadow-elegant duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:rounded-3xl">
          {/* subtle top accent — uses existing gradient token so it stays on-brand across light/dark */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-primary opacity-60" />

          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-4 w-4" /> Waitlist
              </div>
              <Dialog.Close className="rounded-full p-2 hover:bg-secondary/80 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            <Dialog.Title className="font-display text-4xl mt-4 leading-tight">
              Be the <span className="text-primary">first.</span>
            </Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Join the waitlist to receive early access as we roll out integrations with Québec clinics,
              Clic Santé and RVSQ.
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-3 pt-2">
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <input
                id="waitlist-email"
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (hasError) setStatus("idle");
                }}
                disabled={loading || success}
                placeholder="you@example.com"
                aria-invalid={hasError}
                aria-describedby={hasError ? "waitlist-error" : undefined}
                className={`w-full rounded-2xl border bg-background px-4 py-3 text-sm transition
                  focus:outline-none focus:ring-2
                  disabled:opacity-60 disabled:cursor-not-allowed
                  ${hasError
                    ? "border-destructive focus:ring-destructive"
                    : "border-border focus:border-primary focus:ring-primary/40"}`}
              />
            </div>

            {hasError && (
              <div
                id="waitlist-error"
                role="alert"
                className="flex items-start gap-2 text-xs text-destructive"
              >
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success || !emailValid}
              className="group relative mt-1 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl
                         bg-gradient-primary text-sm font-medium text-primary-foreground
                         transition-all duration-300
                         hover:shadow-[0_0_32px_-4px_oklch(0.78_0.16_215/0.5)] hover:scale-[1.01]
                         disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {success && (
                <>
                  <Check className="h-4 w-4" />
                  You're on the list
                </>
              )}
              {!loading && !success && (
                <>
                  Join waitlist
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              <span>Email only. No spam. Unsubscribe anytime.</span>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/*
  SUPABASE SCHEMA — run this once in the SQL editor so the insert above works.
  (Placed here as a comment so it lives next to the code that depends on it.)

  create table if not exists public.waitlist (
    id          uuid primary key default gen_random_uuid(),
    email       text not null unique,
    source      text,
    locale      text,
    created_at  timestamptz not null default now()
  );

  -- Enable row-level security.
  alter table public.waitlist enable row level security;

  -- Allow anonymous inserts only. No one (anon) can read the list.
  create policy "waitlist_insert_anon"
    on public.waitlist for insert
    to anon
    with check (true);

  -- Optional: admins read via a separate policy tied to an authenticated role.
*/