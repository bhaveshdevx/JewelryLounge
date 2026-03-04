/**
 * ============================================================
 * Shared TypeScript Types & Interfaces
 * ============================================================
 *
 * Central type definitions used across the entire app.
 * Mirrors Supabase table schemas exactly.
 *
 * Import from "@/types" for consistent typing everywhere.
 *
 * Example usage:
 *   import type { Product, CartItem, Theme, Order } from "@/types";
 * ============================================================
 */

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

/** The three supported visual themes for the app */
export type Theme = "light" | "dark" | "luxury";

// ---------------------------------------------------------------------------
// Product (mirrors Supabase `products` table)
// ---------------------------------------------------------------------------

/** A single jewelry product from the database */
export interface Product {
    /** Unique product identifier (UUID from Supabase) */
    id: string;

    /** Display name — e.g. "Gold Plated Kundan Choker" */
    title: string;

    /** Full product description (supports markdown / rich text) */
    description: string;

    /** Cost price in INR (₹) — internal/admin use */
    cost_price: number;

    /** Selling price in INR (₹) — shown to customer */
    selling_price: number;

    /**
     * Optional discounted price in INR.
     * If present and < selling_price, the product is "on sale".
     */
    discount_price?: number | null;

    /** Foreign key to the categories table */
    category_id: string;

    /** Array of image/video URLs (first = hero/thumbnail) */
    media_urls: string[];

    /**
     * Flexible product attributes stored as JSON.
     * e.g. { tags: ["best-seller", "campus"], material: "gold", weight: "15g" }
     */
    attributes: Record<string, any>;

    /** Number of units currently in stock */
    stock_count: number;

    /** Whether the product is currently visible/active in the store */
    is_active: boolean;
}

// ---------------------------------------------------------------------------
// Cart (mirrors Supabase `cart` table)
// ---------------------------------------------------------------------------

/** A single row from the cart table */
export interface CartItem {
    /** Row ID (UUID) */
    id: string;

    /** The user this cart item belongs to */
    user_id: string;

    /** Reference to the product */
    product_id: string;

    /** Quantity selected (minimum 1) */
    quantity: number;

    /**
     * Distinguishes saved items:
     *   - null  = regular cart item (has quantity)
     *   - "liked"    = liked/saved item
     *   - "wishlist" = wishlist item
     */
    save_type: "liked" | "wishlist" | null;

    /** ISO timestamp of when the cart item was added */
    created_at?: string;
}

/**
 * CartItem with the full product object resolved (for UI rendering).
 * The Zustand store uses this so components can access product details.
 */
export interface CartItemWithProduct {
    /** The full product object (resolved from product_id) */
    product: Product;

    /** Quantity selected (minimum 1) */
    quantity: number;
}

// ---------------------------------------------------------------------------
// Order (mirrors Supabase `orders` table)
// ---------------------------------------------------------------------------

/** A customer order */
export interface Order {
    /** Unique order identifier (UUID) */
    id: string;

    /** The user who placed this order */
    user_id: string;

    /** Total order amount in INR (₹) */
    total_amount: number;

    /** Payment status — e.g. "pending", "paid", "failed", "refunded" */
    payment_status: string;

    /** Order fulfillment status — e.g. "processing", "shipped", "delivered", "cancelled" */
    order_status: string;

    /** Shipping address and delivery details (JSON) */
    shipping_details: Record<string, any>;

    /** ISO timestamp of when the order was created */
    created_at: string;
}

// ---------------------------------------------------------------------------
// Order Item (mirrors Supabase `order_items` table)
// ---------------------------------------------------------------------------

/** A single line item within an order */
export interface OrderItem {
    /** Row ID (UUID) */
    id: string;

    /** The order this item belongs to */
    order_id: string;

    /** Reference to the product */
    product_id: string;

    /** Price at the time of purchase (snapshot) */
    price_at_purchase: number;

    /** Quantity purchased */
    quantity: number;
}

// ---------------------------------------------------------------------------
// User Profile (mirrors Supabase `profiles` table)
// ---------------------------------------------------------------------------

/** User profile data from the `profiles` table */
export interface UserProfile {
    /** Supabase Auth user ID (matches auth.users.id) */
    id: string;

    /** User's email address */
    email: string;

    /** User role — e.g. "customer", "admin" */
    role: string;

    /** Full display name */
    full_name: string;

    /** Phone number */
    phone_number?: string | null;

    /** Saved shipping addresses (JSON array) */
    saved_addresses?: Record<string, any>[] | null;

    /** ISO timestamp of when the profile was created */
    created_at: string;
}

// ---------------------------------------------------------------------------
// Navigation (app-only, not in Supabase)
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
// Category (app-only — consider creating a Supabase `categories` table)
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
