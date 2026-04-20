import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

/**
 * Server Function: joinWaitlist
 * Simplified implementation to ensure 100% compatibility across both local and Vercel environments.
 */
export const joinWaitlist = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: { email: string; source: string; locale?: string | null } }) => {
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
