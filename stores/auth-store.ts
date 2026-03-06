/**
 * ============================================================
 * Zustand Auth Store
 * ============================================================
 *
 * Global state for Supabase authentication.
 * Tracks current user, profile, loading state, and admin role.
 *
 * Usage:
 *   import { useAuthStore } from "@/stores/auth-store";
 *
 *   const { user, profile, signInWithGoogle, signOut } = useAuthStore();
 * ============================================================
 */

import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types";

// ---------------------------------------------------------------------------
// Store Interface
// ---------------------------------------------------------------------------

interface AuthState {
    /** Supabase auth user (null = not signed in) */
    user: User | null;

    /** Profile row from `profiles` table (null if not loaded) */
    profile: UserProfile | null;

    /** True while checking initial auth state or fetching profile */
    isLoading: boolean;

    /** True if profile.role === "admin" */
    isAdmin: boolean;

    /** Whether the auth listener has been initialized */
    initialized: boolean;

    // ---- Actions ----

    /** Initialize the auth listener — call once in a top-level provider */
    initialize: () => () => void;

    /** Sign in with Google OAuth (popup) */
    signInWithGoogle: () => Promise<void>;

    /** Sign in with email and password */
    signInWithEmail: (email: string, password: string) => Promise<string | null>;

    /** Sign up with email, password, and full name */
    signUpWithEmail: (email: string, password: string, fullName: string) => Promise<string | null>;

    /** Sign out and clear state */
    signOut: () => Promise<void>;

    /** Fetch (or refresh) the profile from Supabase */
    fetchProfile: (userId: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Helpers — Debounce fetchProfile to prevent race conditions
// ---------------------------------------------------------------------------

/** Track in-flight fetchProfile calls to prevent duplicates */
let fetchProfileInFlight: string | null = null;

// ---------------------------------------------------------------------------
// Store Implementation
// ---------------------------------------------------------------------------

// Check if you are running locally or on Vercel
const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your Vercel URL in production
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
        'http://localhost:3000/';

    // Make sure it includes `https://`
    url = url.startsWith('http') ? url : `https://${url}`;
    return url;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    user: null,
    profile: null,
    isLoading: true,
    isAdmin: false,
    initialized: false,

    initialize: () => {
        if (get().initialized) return () => { };

        set({ initialized: true });

        // Check existing session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                set({ user: session.user });
                get().fetchProfile(session.user.id);
            } else {
                set({ isLoading: false });
            }
        });

        // Listen for auth state changes (sign in, sign out, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                set({ user: session.user });
                get().fetchProfile(session.user.id);
            } else {
                set({
                    user: null,
                    profile: null,
                    isAdmin: false,
                    isLoading: false,
                });
            }
        });

        // Return cleanup function
        return () => subscription.unsubscribe();
    },

    // signInWithGoogle: async () => {
    //     const { error } = await supabase.auth.signInWithOAuth({
    //         provider: "google",
    //         options: {
    //             // redirectTo: `${window.location.origin}/`,
    //             redirectTo: `${getURL()}auth/callback`,
    //         },
    //     });
    //     if (error) {
    //         console.error("Google sign-in error:", error.message);
    //     }
    // },

    signInWithGoogle: async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Notice we added 'code' to the flow
                redirectTo: `${getURL()}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    },

    signInWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) return error.message;
        return null;
    },



    signUpWithEmail: async (email, password, fullName) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                // Add this line right here!
                emailRedirectTo: `${getURL()}/auth/callback`,
            },
        });
        if (error) return error.message;
        return null;
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null, isAdmin: false });
    },

    fetchProfile: async (userId: string) => {
        // Prevent duplicate in-flight requests for the same user
        if (fetchProfileInFlight === userId) return;
        fetchProfileInFlight = userId;

        set({ isLoading: true });

        try {
            const { data, error, status } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            // Profile found — use it
            if (data && !error) {
                set({
                    profile: data as UserProfile,
                    isAdmin: data?.role === "admin",
                    isLoading: false,
                });
                return;
            }

            // No profile row found — could be:
            //   - PGRST116 (PostgREST "no rows" with 406 status)
            //   - 406 status from RLS blocking the read
            //   - Any other "not found" scenario
            // In all these cases, try to create the profile as a fallback
            // (the DB trigger should handle this, but this is a safety net
            //  for users who signed up before the trigger was added)
            const isNoRowError =
                error?.code === "PGRST116" ||
                status === 406;

            if (isNoRowError) {
                const user = get().user;
                const fullName =
                    user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    user?.email?.split("@")[0] ||
                    "User";
                const userEmail = user?.email || "";

                const { data: newProfile, error: insertError } = await supabase
                    .from("profiles")
                    .insert({
                        id: userId,
                        full_name: fullName,
                        email: userEmail,
                        role: "customer",
                    })
                    .select()
                    .single();

                if (insertError) {
                    // 409 Conflict = profile was already created (e.g. by DB trigger
                    // or a parallel request). Try fetching it again.
                    if (insertError.code === "23505" || insertError.message?.includes("duplicate")) {
                        // Wait briefly for the trigger-created row to be fully committed
                        await new Promise((r) => setTimeout(r, 500));

                        const { data: retryData } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", userId)
                            .single();

                        if (retryData) {
                            set({
                                profile: retryData as UserProfile,
                                isAdmin: retryData?.role === "admin",
                                isLoading: false,
                            });
                            return;
                        }
                    }

                    console.error("Failed to create profile:", insertError.message);
                    set({ profile: null, isAdmin: false, isLoading: false });
                    return;
                }

                set({
                    profile: newProfile as UserProfile,
                    isAdmin: false,
                    isLoading: false,
                });
                return;
            }

            // Some other unexpected error
            if (error) {
                console.error("Failed to fetch profile:", error.message);
            }
            set({ profile: null, isAdmin: false, isLoading: false });
        } finally {
            fetchProfileInFlight = null;
        }
    },
}));
