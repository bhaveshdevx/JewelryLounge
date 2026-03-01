/**
 * ============================================================
 * Supabase Client — Server Side
 * ============================================================
 *
 * Creates a Supabase client for use in Server Components,
 * Route Handlers, and Server Actions.
 *
 * NOTE: This is a placeholder. In production, you'll want to use
 * @supabase/ssr to create a server-side client that handles
 * cookie-based auth properly with Next.js App Router.
 *
 * For now, we export a simple createClient call using the
 * service role key (for server-only operations) or the anon key.
 *
 * Environment variables required (set in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL      — Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY     — Server-only service role key (keep secret!)
 *
 * Usage:
 *   import { createServerSupabase } from "@/lib/supabase/server";
 *
 *   const supabase = createServerSupabase();
 *   const { data } = await supabase.from("products").select("*");
 * ============================================================
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Creates a new Supabase client for server-side use.
 * Each request should create its own instance to avoid cross-request state leaks.
 */
export function createServerSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error(
            "Missing Supabase server env variables. " +
            "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local.",
        );
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            // Server-side: we don't persist sessions
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
