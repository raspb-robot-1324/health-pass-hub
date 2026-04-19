import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

async function main() {
  console.log("Testing with the CRXP1... local anon key...");
  const { data, error } = await supabase.from('waitlist').select('count', { count: 'exact', head: true }).limit(1);
  if (error) {
    console.error("Error connecting to Supabase:", error);
    process.exit(1);
  } else {
    console.log("Successfully connected! The CRXP1... anon key is indeed correct for the local setup.");
  }
}

main();
