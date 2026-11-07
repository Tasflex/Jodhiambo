import "server-only";

import { createClient } from "@supabase/supabase-js";
import { requireEnv, supabaseUrl } from "@/lib/env";

/**
 * Service-role client: bypasses row level security. Server-only, and only for
 * trusted operations (creating orders, fulfilling payments, reading PDFs).
 */
export function createSupabaseAdminClient() {
  return createClient(supabaseUrl(), requireEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const MATERIALS_BUCKET = "materials";
