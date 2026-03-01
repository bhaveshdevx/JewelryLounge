/**
 * ============================================================
 * Supabase Client — Browser Side
 * ============================================================
 *
 * Creates a Supabase client for use in browser/client components.
 * This client handles Auth, DB queries, and Storage from the frontend.
 *
 * Environment variables required (set in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL      — Your Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY — Your Supabase project anon/public key
 *
 * Usage:
 *   import { supabase } from "@/lib/supabase/client";
 *
 *   const { data, error } = await supabase.from("products").select("*");
 * ============================================================
 */

import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Validate environment variables at build time
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error(
        "Missing env variable: NEXT_PUBLIC_SUPABASE_URL. " +
        "Add it to your .env.local file.",
    );
}

if (!supabaseAnonKey) {
    throw new Error(
        "Missing env variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Add it to your .env.local file.",
    );
}

// ---------------------------------------------------------------------------
// Create & export the browser Supabase client (singleton)
// ---------------------------------------------------------------------------

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
