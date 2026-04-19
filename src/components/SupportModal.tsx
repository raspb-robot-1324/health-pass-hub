import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { HeartPulse, X, ChevronRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

export function SupportModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number | string>(25);
  const presets = [10, 25, 50, 100];
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    setLoading(true);
    // In a real app, you would make an API call to your backend to create a Checkout Session here.
    // For now, we simulate a small delay before redirecting to a predetermined Stripe Payment Link
    // or showing a success UI.
    setTimeout(() => {
      // e.g. window.location.href = "https://buy.stripe.com/test_123456789";
      alert(`Directed to Stripe for $${amount}`);
      setLoading(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-elegant duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                <HeartPulse className="h-4 w-4" /> Support the cause
              </div>
              <Dialog.Close className="rounded-full p-2 hover:bg-secondary/80 transition focus:outline-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>
            <Dialog.Title className="font-display text-4xl mt-4">Fuel the <span className="italic text-primary">vision.</span></Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-2 text-sm leading-relaxed">
              We are building a unified medical operating system for Quebec. Your contribution helps us maintain servers and expand integrations with the provincial systems.
            </Dialog.Description>
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`rounded-xl border py-3 text-center transition ${amount === p ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-secondary"}`}
                >
                  ${p}
                </button>
              ))}
            </div>
            
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground font-mono">$</div>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Custom amount"
                className="w-full rounded-full border border-border bg-background px-8 py-4 text-center font-display text-2xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="absolute inset-y-0 right-5 flex items-center text-muted-foreground font-mono text-sm">CAD</div>
            </div>
          </div>

          <button 
            disabled={loading || !amount}
            onClick={handleDonate}
            className="group mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Preparing..." : `Donate $${amount}`}
            {!loading && <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
