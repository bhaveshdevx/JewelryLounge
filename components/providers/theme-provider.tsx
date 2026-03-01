/**
 * ============================================================
 * ThemeProvider — Client Component
 * ============================================================
 *
 * Reads the active theme from the Zustand theme store and applies
 * the corresponding CSS class to the <html> element.
 *
 * This component should wrap {children} in the root layout so the
 * theme class is always in sync with the store.
 *
 * Theme mapping:
 *   "light"  → removes "dark" and "luxury" classes (default state)
 *   "dark"   → adds "dark" class
 *   "luxury" → adds "luxury" class
 *
 * Usage (in layout.tsx):
 *   import { ThemeProvider } from "@/components/providers/theme-provider";
 *   <ThemeProvider>{children}</ThemeProvider>
 * ============================================================
 */

"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        // Get the <html> element
        const root = document.documentElement;

        // Remove all theme classes first
        root.classList.remove("light", "dark", "luxury");

        // Apply the active theme class
        root.classList.add(theme);
    }, [theme]);

    return <>{children}</>;
}
