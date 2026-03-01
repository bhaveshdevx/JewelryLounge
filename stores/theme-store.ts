/**
 * ============================================================
 * Zustand Theme Store
 * ============================================================
 *
 * Manages the active visual theme (Light / Dark / Luxury).
 * Persisted to localStorage so the user's choice survives refreshes.
 *
 * The active theme is applied as a CSS class on the <html> element:
 *   - "light"  → default (no class needed, but we add it for clarity)
 *   - "dark"   → adds class "dark"
 *   - "luxury" → adds class "luxury"
 *
 * Usage:
 *   import { useThemeStore } from "@/stores/theme-store";
 *
 *   const { theme, setTheme, cycleTheme } = useThemeStore();
 * ============================================================
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Ordered list of themes for cycling */
const THEME_ORDER: Theme[] = ["light", "dark", "luxury"];

// ---------------------------------------------------------------------------
// Store Interface
// ---------------------------------------------------------------------------

interface ThemeState {
    /** The currently active theme */
    theme: Theme;

    /** Set a specific theme */
    setTheme: (theme: Theme) => void;

    /**
     * Cycle to the next theme in order: light → dark → luxury → light
     * Useful for a single toggle button.
     */
    cycleTheme: () => void;
}

// ---------------------------------------------------------------------------
// Store Implementation
// ---------------------------------------------------------------------------

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: "light",

            setTheme: (theme) => set({ theme }),

            cycleTheme: () => {
                const currentIndex = THEME_ORDER.indexOf(get().theme);
                const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
                set({ theme: THEME_ORDER[nextIndex] });
            },
        }),
        {
            // Persist theme choice to localStorage under this key
            name: "jewelry-lounge-theme",
        },
    ),
);
