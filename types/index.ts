/**
 * ============================================================
 * Shared TypeScript Types & Interfaces
 * ============================================================
 *
 * Central type definitions used across the entire app.
 * Import from "@/types" for consistent typing everywhere.
 *
 * Example usage:
 *   import type { Product, CartItem, Theme } from "@/types";
 * ============================================================
 */

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

/** The three supported visual themes for the app */
export type Theme = "light" | "dark" | "luxury";

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------

/** A single jewelry product from the database */
export interface Product {
    /** Unique product identifier (UUID from Supabase) */
    id: string;

    /** Display name — e.g. "Gold Plated Kundan Choker" */
    name: string;

    /** URL-friendly slug for SEO routing — e.g. "gold-plated-kundan-choker" */
    slug: string;

    /** Full product description (supports markdown / rich text) */
    description: string;

    /** Price in INR (₹) — stored as number for calculations */
    price: number;

    /**
     * Optional sale/discounted price in INR.
     * If present and < price, the product is "on sale".
     */
    salePrice?: number;

    /** Array of image URLs (first image = hero/thumbnail) */
    images: string[];

    /** Optional video URL for the TikTok-style video feed */
    videoUrl?: string;

    /** Category this product belongs to — e.g. "Necklaces", "Earrings" */
    category: string;

    /** Tags for filtering/search — e.g. ["wedding", "festive", "daily-wear"] */
    tags: string[];

    /** Whether the product is currently in stock */
    inStock: boolean;

    /** ISO timestamp of when the product was created */
    createdAt: string;
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

/** A single item in the user's cart */
export interface CartItem {
    /** The product being purchased */
    product: Product;

    /** Quantity selected (minimum 1) */
    quantity: number;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/** A navigation link used in Header, BottomNav, or Footer */
export interface NavItem {
    /** Display label — e.g. "Home", "Shop" */
    label: string;

    /** Route path — e.g. "/", "/shop", "/cart" */
    href: string;

    /** Optional Lucide icon name — e.g. "Home", "ShoppingBag" */
    icon?: string;
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

/** A product category shown as story-style bubbles */
export interface Category {
    /** Unique category identifier */
    id: string;

    /** Display name — e.g. "Earrings" */
    name: string;

    /** URL-friendly slug */
    slug: string;

    /** Thumbnail image URL for the story bubble */
    image: string;
}

// ---------------------------------------------------------------------------
// User (basic — extended by Supabase Auth)
// ---------------------------------------------------------------------------

/** Minimal user profile (mirrors Supabase auth.users) */
export interface UserProfile {
    /** Supabase Auth user ID */
    id: string;

    /** User's email address */
    email: string;

    /** Display name (from profile metadata) */
    name?: string;

    /** Avatar URL */
    avatarUrl?: string;
}
