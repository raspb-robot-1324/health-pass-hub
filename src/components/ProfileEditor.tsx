import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { X, Plus, Trash2, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMedicalBundle, type Medication, type Allergy, type Condition, type Contact } from "@/lib/medical";

export function ProfileEditor({ open, onOpenChange, profileId, onSaved }: { open: boolean; onOpenChange: (open: boolean) => void; profileId: string; onSaved: () => void }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [meds, setMeds] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  const [ramq, setRamq] = useState("");
  const [bloodType, setBloodType] = useState("");

  useEffect(() => {
    if (open && profileId) {
      setLoading(true);
      getMedicalBundle(profileId).then(b => {
        setMeds(b.medications);
        setAllergies(b.allergies);
        setConditions(b.conditions);
        setContacts(b.contacts);
        setLoading(false);
      });

      supabase.from("profiles").select("ramq_number, blood_type").eq("id", profileId).single().then(({ data }) => {
        if (data) {
          setRamq(data.ramq_number || "");
          setBloodType(data.blood_type || "");
        }
      });
    }
  }, [open, profileId]);

  const removeMed = (id: string) => setMeds(meds.filter(m => m.id !== id));
  const removeAllergy = (id: string) => setAllergies(allergies.filter(a => a.id !== id));
  const removeCondition = (id: string) => setConditions(conditions.filter(c => c.id !== id));
  const removeContact = (id: string) => setContacts(contacts.filter(c => c.id !== id));

  const addMed = () => setMeds([...meds, { id: crypto.randomUUID(), name: "", dose: "", schedule: "", notes: "" }]);
  const addAllergy = () => setAllergies([...allergies, { id: crypto.randomUUID(), name: "", severity: "Mild" }]);
  const addCondition = () => setConditions([...conditions, { id: crypto.randomUUID(), name: "", diagnosed_at: new Date().toISOString().split("T")[0] }]);
  const addContact = () => setContacts([...contacts, { id: crypto.randomUUID(), name: "", relation: "", phone: "" }]);

  const updateMed = (id: string, field: keyof Medication, value: string) => {
    setMeds(meds.map(m => m.id === id ? { ...m, [field]: value } : m));
  };
  const updateAllergy = (id: string, field: keyof Allergy, value: string) => {
    setAllergies(allergies.map(a => a.id === id ? { ...a, [field]: value } : a));
  };
  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  const updateContact = (id: string, field: keyof Contact, value: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update main profile
      await supabase.from("profiles").update({ 
        ramq_number: ramq, 
        blood_type: bloodType 
      }).eq("id", profileId);
      
      // 2. Clear existing entries for child tables
      await Promise.all([
        supabase.from("medications").delete().eq("profile_id", profileId),
        supabase.from("allergies").delete().eq("profile_id", profileId),
        supabase.from("conditions").delete().eq("profile_id", profileId),
        supabase.from("emergency_contacts").delete().eq("profile_id", profileId),
      ]);

      // 3. Insert new entries
      const medsToInsert = meds.filter(m => m.name.trim()).map(({ id, ...rest }) => ({ ...rest, profile_id: profileId }));
      const allergiesToInsert = allergies.filter(a => a.name.trim()).map(({ id, ...rest }) => ({ ...rest, profile_id: profileId }));
      const conditionsToInsert = conditions.filter(c => c.name.trim()).map(({ id, ...rest }) => ({ ...rest, profile_id: profileId }));
      const contactsToInsert = contacts.filter(c => c.name.trim()).map(({ id, ...rest }) => ({ ...rest, profile_id: profileId }));

      await Promise.all([
        medsToInsert.length ? supabase.from("medications").insert(medsToInsert) : Promise.resolve(),
        allergiesToInsert.length ? supabase.from("allergies").insert(allergiesToInsert) : Promise.resolve(),
        conditionsToInsert.length ? supabase.from("conditions").insert(conditionsToInsert) : Promise.resolve(),
        contactsToInsert.length ? supabase.from("emergency_contacts").insert(contactsToInsert) : Promise.resolve(),
      ]);

      onSaved();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card shadow-elegant duration-200 sm:rounded-3xl flex flex-col h-[700px] max-h-[90vh]">
          
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Dialog.Title className="font-display text-3xl">Edit Medical Profile</Dialog.Title>
            <Dialog.Close className="rounded-full p-2 hover:bg-secondary/80 transition focus:outline-none">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-hidden p-6 pt-0 mt-4">
            {loading ? (
              <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <Tabs.Root defaultValue="personal" className="flex flex-col h-full">
                <Tabs.List className="flex gap-4 border-b border-border pb-2 overflow-x-auto hide-scrollbar">
                  <Tabs.Trigger value="personal" className="text-sm font-mono uppercase tracking-widest text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary pb-2 transition">Personal</Tabs.Trigger>
                  <Tabs.Trigger value="meds" className="text-sm font-mono uppercase tracking-widest text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary pb-2 transition">Medications</Tabs.Trigger>
                  <Tabs.Trigger value="conditions" className="text-sm font-mono uppercase tracking-widest text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary pb-2 transition">Health</Tabs.Trigger>
                  <Tabs.Trigger value="contacts" className="text-sm font-mono uppercase tracking-widest text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary pb-2 transition">Contacts</Tabs.Trigger>
                </Tabs.List>

                <div className="flex-1 overflow-y-auto pt-6 pr-2">
                  <Tabs.Content value="personal" className="space-y-4">
                    <div>
                      <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1 block">RAMQ Number (Public Insurance)</label>
                      <input 
                        value={ramq} 
                        onChange={(e) => setRamq(e.target.value)}
                        placeholder="ABCD 1234 5678"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Blood Type</label>
                      <input 
                        value={bloodType} 
                        onChange={(e) => setBloodType(e.target.value)}
                        placeholder="e.g. O+"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="meds" className="space-y-4">
                    {meds.map(m => (
                      <div key={m.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 border border-border p-4 rounded-xl relative group">
                        <div className="md:col-span-12 flex justify-between items-center mb-1">
                           <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Medication</div>
                           <button onClick={() => removeMed(m.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-full transition"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                        <input 
                          value={m.name} 
                          onChange={(e) => updateMed(m.id, "name", e.target.value)}
                          placeholder="Name (e.g. Lithium)"
                          className="md:col-span-5 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                        <input 
                          value={m.dose || ""} 
                          onChange={(e) => updateMed(m.id, "dose", e.target.value)}
                          placeholder="Dose (e.g. 300mg)"
                          className="md:col-span-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                        <input 
                          value={m.schedule || ""} 
                          onChange={(e) => updateMed(m.id, "schedule", e.target.value)}
                          placeholder="Schedule (e.g. 2x Daily)"
                          className="md:col-span-4 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    ))}
                    <button onClick={addMed} className="flex w-full items-center justify-center gap-2 border border-dashed border-border p-4 rounded-xl text-muted-foreground hover:bg-secondary transition font-mono text-xs uppercase tracking-widest">
                      <Plus className="h-4 w-4" /> Add Medication
                    </button>
                  </Tabs.Content>

                  <Tabs.Content value="conditions" className="space-y-6">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Medical Conditions</div>
                      {conditions.map(c => (
                        <div key={c.id} className="flex items-center gap-3 mb-3">
                          <input 
                            value={c.name} 
                            onChange={(e) => updateCondition(c.id, "name", e.target.value)}
                            placeholder="Condition (e.g. Asthma)"
                            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                          />
                          <button onClick={() => removeCondition(c.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-full"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                      <button onClick={addCondition} className="flex w-full items-center justify-center gap-2 border border-dashed border-border p-3 rounded-xl text-muted-foreground hover:bg-secondary transition font-mono text-xs uppercase tracking-widest">
                        <Plus className="h-4 w-4" /> Add Condition
                      </button>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Allergies</div>
                      {allergies.map(a => (
                        <div key={a.id} className="flex items-center gap-3 mb-3">
                          <input 
                            value={a.name} 
                            onChange={(e) => updateAllergy(a.id, "name", e.target.value)}
                            placeholder="Allergy (e.g. Penicillin)"
                            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                          />
                          <select 
                             value={a.severity || "Mild"}
                             onChange={(e) => updateAllergy(a.id, "severity", e.target.value)}
                             className="rounded-lg border border-border bg-background px-2 py-2 text-sm"
                          >
                             <option value="Mild">Mild</option>
                             <option value="Moderate">Moderate</option>
                             <option value="Severe">Severe</option>
                          </select>
                          <button onClick={() => removeAllergy(a.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-full"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                      <button onClick={addAllergy} className="flex w-full items-center justify-center gap-2 border border-dashed border-border p-3 rounded-xl text-muted-foreground hover:bg-secondary transition font-mono text-xs uppercase tracking-widest">
                        <Plus className="h-4 w-4" /> Add Allergy
                      </button>
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="contacts" className="space-y-4">
                    {contacts.map(c => (
                      <div key={c.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 border border-border p-4 rounded-xl">
                        <div className="md:col-span-12 flex justify-between items-center mb-1">
                           <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Emergency Contact</div>
                           <button onClick={() => removeContact(c.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-full transition"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                        <input 
                          value={c.name} 
                          onChange={(e) => updateContact(c.id, "name", e.target.value)}
                          placeholder="Contact Name"
                          className="md:col-span-5 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                        <input 
                          value={c.relation || ""} 
                          onChange={(e) => updateContact(c.id, "relation", e.target.value)}
                          placeholder="Relation (e.g. Mother)"
                          className="md:col-span-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                        <input 
                          value={c.phone} 
                          onChange={(e) => updateContact(c.id, "phone", e.target.value)}
                          placeholder="Phone Number"
                          className="md:col-span-4 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    ))}
                    <button onClick={addContact} className="flex w-full items-center justify-center gap-2 border border-dashed border-border p-4 rounded-xl text-muted-foreground hover:bg-secondary transition font-mono text-xs uppercase tracking-widest">
                      <Plus className="h-4 w-4" /> Add Emergency Contact
                    </button>
                  </Tabs.Content>
                </div>
              </Tabs.Root>
            )}
          </div>

          <div className="p-6 border-t border-border bg-card sm:rounded-b-3xl flex justify-end">
             <button 
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3 text-sm font-medium transition hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving Changes..." : "Save Medical Profile"}
              </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
