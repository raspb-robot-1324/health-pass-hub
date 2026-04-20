import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

/**
 * Server Function: joinWaitlist
 * Executes on the server to bypass browser-level network issues (CORS, Ad-blockers, Mixed Content).
 */
export const joinWaitlist = createServerFn({ method: "POST" })
  .validator((d: { email: string; source: string; locale?: string | null }) => d)
  .handler(async ({ data }) => {
    const { email, source, locale } = data;
    const normalized = email.trim().toLowerCase();

    const { error } = await supabase.from("waitlist").insert({
      email: normalized,
      source,
      locale,
    });

    if (error) {
      // Postgres unique_violation code — treat as "already joined" (soft success).
      if (error.code === "23505") {
        return { success: true, alreadyJoined: true };
      }
      console.error("Server-side Waitlist insert failed:", error);
      throw error;
    }

    return { success: true };
  });
