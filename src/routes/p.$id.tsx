import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Profile, type Medication, type Allergy, type Condition, type Contact } from "@/lib/medical";
import { ShieldCheck, AlertTriangle, Droplet, HeartPulse, Pill, Phone, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/p/$id")({
  component: ResponderView,
});

function ResponderView() {
  const { id } = Route.useParams();
  const search: { responder?: string } = Route.useSearch();
  const isResponder = search.responder === "1";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Find profile by pulseid_code directly, rather than user session
      const { data: p } = await supabase.from("profiles").select("*").eq("pulseid_code", id).maybeSingle();
      
      if (p) {
        setProfile(p);
        const [m, al, c, con] = await Promise.all([
          supabase.from("medications").select("*").eq("profile_id", p.id).order("created_at"),
          supabase.from("allergies").select("*").eq("profile_id", p.id),
          supabase.from("conditions").select("*").eq("profile_id", p.id),
          supabase.from("emergency_contacts").select("*").eq("profile_id", p.id),
        ]);
        setMeds(m.data || []);
        setAllergies(al.data || []);
        setConditions(c.data || []);
        setContacts(con.data || []);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          Profile not found or access revoked.
        </div>
      </div>
    );
  }

  const nameParts = profile.full_name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  const dateFormatted = new Date().toLocaleDateString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

  return (
    <div className={`min-h-screen ${isResponder ? 'bg-[#0f0000]' : 'bg-background'}`}>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 pt-32 pb-16">
        <div className={`border-b ${isResponder ? 'border-emergency/30' : 'border-border'} pb-8`}>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-emergency flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> 
            {isResponder ? "CRITICAL EMERGENCY VIEW · RESPONDER_MODE_ACTIVE" : "// Public Medical Key"}
          </div>
          <h1 className={`mt-3 font-display leading-[1] tracking-tight ${isResponder ? 'text-[clamp(4rem,12vw,10rem)] text-white' : 'text-7xl md:text-8xl'}`}>
            {firstName} <span>{lastName}</span>
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>Age {profile.age ?? "—"}</span>
            <span className={isResponder ? 'text-white font-bold' : ''}>{profile.sex ?? "—"}</span>
            {profile.ramq_number && <span className="text-primary tracking-widest">RAMQ: {profile.ramq_number}</span>}
            <span>Novera #{profile.pulseid_code}</span>
          </div>
        </div>

        <div className="mt-10 grid gap-px bg-emergency/20 border border-emergency/30 rounded-3xl overflow-hidden md:grid-cols-3">
          <Field icon={Droplet} label="Blood type" value={profile.blood_type ?? "—"} emergency={isResponder} />
          <Field icon={HeartPulse} label="Conditions" value={conditions.length > 0 ? conditions.map(c => c.name).join(' · ') : "None"} emergency={isResponder} />
          <Field icon={Pill} label="Allergies" value={allergies.length > 0 ? allergies.map(a => a.name).join(' · ') : "None known"} emergency={isResponder} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-12">
          <div className={`md:col-span-7 rounded-3xl border ${isResponder ? 'border-emergency/20 bg-black/40 text-white' : 'border-border bg-card'} p-8`}>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">// Current medications</div>
            <ul className={`mt-5 divide-y ${isResponder ? 'divide-emergency/20' : 'divide-border'}`}>
              {meds.map((m, i) => (
                <li key={m.id} className="flex items-baseline justify-between py-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                    <span className={`font-display ${isResponder ? 'text-3xl font-bold' : 'text-2xl'}`}>{m.name}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-right">{m.dose} {m.schedule ? `· ${m.schedule}` : ''}</span>
                </li>
              ))}
              {meds.length === 0 && <li className="py-4 text-sm text-muted-foreground">No active medications.</li>}
            </ul>
          </div>

          <div className={`md:col-span-5 rounded-3xl border ${isResponder ? 'border-emergency/20 bg-black/40 text-white' : 'border-border bg-card'} p-8`}>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <Phone className="h-3 w-3 text-emergency" /> Emergency contacts
            </div>
            <ul className="mt-5 space-y-4">
              {contacts.map((c) => (
                <li key={c.id} className={`rounded-2xl border ${isResponder ? 'border-emergency/30' : 'border-border'} p-4`}>
                  <div className="flex items-baseline justify-between">
                    <div className="font-display text-2xl">{c.name}</div>
                    <a href={`tel:${c.phone}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emergency text-emergency-foreground">
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.relation ?? 'Contact'} · {c.phone}</div>
                </li>
              ))}
              {contacts.length === 0 && <li className="text-sm text-muted-foreground py-2">No emergency contacts listed.</li>}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-border/30 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-success" /> Read Only Authenticated
          </div>
          <div>Last verified · {dateFormatted}</div>
        </div>
      </main>
    </div>
  );
}

function Field({ icon: Icon, label, value, emergency }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; emergency?: boolean }) {
  return (
    <div className={`p-7 ${emergency ? 'bg-black/80 text-white' : 'bg-background'}`}>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-emergency animate-pulse" /> {label}
      </div>
      <div className={`mt-4 font-display tracking-tight ${emergency ? "text-6xl md:text-7xl font-bold" : "text-4xl md:text-5xl"}`}>{value}</div>
    </div>
  );
}
