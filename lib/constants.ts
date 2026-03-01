/**
 * ============================================================
 * App-Wide Constants
 * ============================================================
 *
 * Single source of truth for values used across the application.
 * Import from "@/lib/constants" to avoid magic strings/numbers.
 *
 * Example usage:
 *   import { SITE_NAME, NAV_ITEMS } from "@/lib/constants";
 * ============================================================
 */

import type { NavItem } from "@/types";

// ---------------------------------------------------------------------------
// Site Identity
// ---------------------------------------------------------------------------

/** The brand name displayed in the header, metadata, and footer */
export const SITE_NAME = "Jewelry Lounge" as const;

/** Short tagline used in meta descriptions and hero sections */
export const SITE_TAGLINE = "Shop Trendy. Shop Fast. Slay Every Occasion." as const;

/** Full site description for SEO meta tags */
export const SITE_DESCRIPTION =
    "Jewelry Lounge — India's trendiest fast-fashion jewelry store for Gen Z & Millennials. Affordable to mid-premium necklaces, earrings, bracelets & more for every occasion." as const;

/** Base URL (update when deploying to production) */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/**
 * Bottom navigation items for the mobile tab bar.
 * Each entry maps to a route and an optional Lucide icon name.
 */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
    { label: "Home", href: "/", icon: "Home" },
    { label: "Shop", href: "/shop", icon: "ShoppingBag" },
    { label: "Cart", href: "/cart", icon: "ShoppingCart" },
    { label: "Profile", href: "/profile", icon: "User" },
];

/**
 * Header navigation links (desktop).
 * Shown in the top nav alongside the logo.
 */
export const HEADER_NAV_ITEMS: NavItem[] = [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Collections", href: "/collections" },
    { label: "Trending", href: "/trending" },
    { label: "Sale", href: "/sale" },
];

// ---------------------------------------------------------------------------
// Breakpoints (mirrors Tailwind defaults — useful in JS/hooks)
// ---------------------------------------------------------------------------

export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

/** Currency symbol used throughout the app */
export const CURRENCY = "₹" as const;

/** Default number of products to fetch per page */
export const PRODUCTS_PER_PAGE = 20;

/** Maximum items allowed in cart */
export const MAX_CART_ITEMS = 50;
