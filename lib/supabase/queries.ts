/**
 * ============================================================
 * Supabase Queries — Data Access Layer
 * ============================================================
 *
 * Reusable async functions for all CRUD operations against
 * the Supabase database. Uses the browser client by default.
 *
 * Import from "@/lib/supabase/queries" for clean data fetching.
 *
 * Example usage:
 *   import { getProducts, getProductById } from "@/lib/supabase/queries";
 *
 *   const products = await getProducts({ limit: 20, activeOnly: true });
 *   const product  = await getProductById("some-uuid");
 * ============================================================
 */

import { supabase } from "./client";
import type {
    Product,
    UserProfile,
    CartItem,
    Order,
    OrderItem,
} from "@/types";

// ============================================================
// Products
// ============================================================

/** Options for filtering/paginating the product list */
export interface GetProductsOptions {
    /** Only return active products (default: true) */
    activeOnly?: boolean;
    /** Filter by category UUID */
    categoryId?: string;
    /** Filter by tag inside attributes.tags */
    tag?: string;
    /** Maximum selling price */
    maxPrice?: number;
    /** Minimum selling price */
    minPrice?: number;
    /** Number of results to return (default: 20) */
    limit?: number;
    /** Offset for pagination (default: 0) */
    offset?: number;
    /** Column to order by (default: "id") */
    orderBy?: string;
    /** Ascending order? (default: false → newest first) */
    ascending?: boolean;
}

/**
 * Fetch a paginated list of products with optional filters.
 *
 * @example
 *   const { data, error, count } = await getProducts({ tag: "best-seller", limit: 10 });
 */
export async function getProducts(options: GetProductsOptions = {}) {
    const {
        activeOnly = true,
        categoryId,
        tag,
        maxPrice,
        minPrice,
        limit = 20,
        offset = 0,
        orderBy = "id",
        ascending = false,
    } = options;

    let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .order(orderBy, { ascending })
        .range(offset, offset + limit - 1);

    // Apply filters
    if (activeOnly) {
        query = query.eq("is_active", true);
    }
    if (categoryId) {
        query = query.eq("category_id", categoryId);
    }
    if (tag) {
        // Filter products whose attributes->'tags' array contains the tag
        query = query.contains("attributes", { tags: [tag] });
    }
    if (minPrice !== undefined) {
        query = query.gte("selling_price", minPrice);
    }
    if (maxPrice !== undefined) {
        query = query.lte("selling_price", maxPrice);
    }

    return query;
}

/**
 * Fetch a single product by its UUID.
 *
 * @example
 *   const { data, error } = await getProductById("abc-123");
 */
export async function getProductById(id: string) {
    return supabase.from("products").select("*").eq("id", id).single();
}

/**
 * Fetch all products belonging to a specific category.
 *
 * @example
 *   const { data, error } = await getProductsByCategory("cat-uuid");
 */
export async function getProductsByCategory(categoryId: string) {
    return supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .order("id", { ascending: false });
}

/**
 * Search products by title or description (case-insensitive).
 *
 * @example
 *   const { data, error } = await searchProducts("gold ring");
 */
export async function searchProducts(query: string) {
    if (!query) return { data: [], error: null };

    // Using a safer approach for searching, matching words anywhere in title or description.
    // If description is null, it might cause issues in some older Supabase versions, but
    // usually `or()` handles it. We'll simplify the match.
    return supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order("selling_price", { ascending: true })
        .limit(50);
}



// ============================================================
// Profiles
// ============================================================

/**
 * Fetch a user profile by their auth user ID.
 *
 * @example
 *   const { data, error } = await getProfile(user.id);
 */
export async function getProfile(userId: string) {
    return supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
}

/**
 * Update a user's profile fields.
 *
 * @example
 *   const { data, error } = await updateProfile(userId, { full_name: "Jane Doe" });
 */
export async function updateProfile(
    userId: string,
    updates: Partial<Pick<UserProfile, "full_name" | "phone_number" | "saved_addresses">>,
) {
    return supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();
}

// ============================================================
// Cart
// ============================================================

/**
 * Fetch all cart items for a user, with full product data joined.
 *
 * @example
 *   const { data, error } = await getCartItems(userId);
 *   // data[0].product.title, data[0].quantity, etc.
 */
export async function getCartItems(userId: string) {
    return supabase
        .from("cart")
        .select("*, product:products(*)")
        .eq("user_id", userId)
        .is("save_type", null)
        .order("id", { ascending: false });
}

/**
 * Fetch wishlist items for a user, with full product data joined.
 *
 * @example
 *   const { data, error } = await getWishlistItems(userId);
 */
export async function getWishlistItems(userId: string) {
    return supabase
        .from("cart")
        .select("*, product:products(*)")
        .eq("user_id", userId)
        .eq("save_type", "wishlist")
        .order("id", { ascending: false });
}

/**
 * Fetch liked items for a user, with full product data joined.
 *
 * @example
 *   const { data, error } = await getLikedItems(userId);
 */
export async function getLikedItems(userId: string) {
    return supabase
        .from("cart")
        .select("*, product:products(*)")
        .eq("user_id", userId)
        .eq("save_type", "liked")
        .order("id", { ascending: false });
}

/**
 * Add a product to the user's cart (or wishlist).
 * Uses upsert to increment quantity if the item already exists.
 *
 * @example
 *   const { data, error } = await addToCart(userId, productId, 1, "cart");
 */
export async function addToCart(
    userId: string,
    productId: string,
    quantity: number = 1,
    saveType: "liked" | "wishlist" | null = null,
) {
    // Check if item already exists
    let existingQuery = supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("product_id", productId);

    // Filter by save_type (null = cart, "liked" / "wishlist" = saved)
    existingQuery = saveType === null
        ? existingQuery.is("save_type", null)
        : existingQuery.eq("save_type", saveType);

    const { data: existing } = await existingQuery.single();

    if (existing) {
        // Update quantity of existing item
        return supabase
            .from("cart")
            .update({ quantity: existing.quantity + quantity })
            .eq("id", existing.id)
            .select()
            .single();
    }

    // Insert new cart row
    return supabase
        .from("cart")
        .insert({ user_id: userId, product_id: productId, quantity, save_type: saveType })
        .select()
        .single();
}

/**
 * Update the quantity of a specific cart item.
 *
 * @example
 *   const { data, error } = await updateCartQuantity(cartItemId, 3);
 */
export async function updateCartQuantity(cartItemId: string, quantity: number) {
    return supabase
        .from("cart")
        .update({ quantity })
        .eq("id", cartItemId)
        .select()
        .single();
}

/**
 * Remove a specific item from the cart/wishlist.
 *
 * @example
 *   const { data, error } = await removeFromCart(cartItemId);
 */
export async function removeFromCart(cartItemId: string) {
    return supabase.from("cart").delete().eq("id", cartItemId);
}

/**
 * Clear all cart items for a user (useful after checkout).
 *
 * @example
 *   await clearCart(userId);
 */
export async function clearCart(userId: string) {
    return supabase
        .from("cart")
        .delete()
        .eq("user_id", userId)
        .is("save_type", null);
}

// ============================================================
// Orders
// ============================================================

/**
 * Fetch all orders for a user, newest first.
 *
 * @example
 *   const { data, error } = await getOrders(userId);
 */
export async function getOrders(userId: string) {
    return supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
}

/**
 * Fetch a single order with its line items and product details.
 *
 * @example
 *   const { data, error } = await getOrderById(orderId);
 *   // data.order_items[0].product.title
 */
export async function getOrderById(orderId: string) {
    return supabase
        .from("orders")
        .select("*, order_items:order_items(*, product:products(*))")
        .eq("id", orderId)
        .single();
}

/**
 * Create a new order with line items.
 * Typically called at checkout after payment confirmation.
 *
 * @example
 *   const { data, error } = await createOrder(userId, [
 *     { product_id: "p1", price_at_purchase: 699, quantity: 2 },
 *   ], { address: "123 Street", city: "Mumbai" });
 */
export async function createOrder(
    userId: string,
    items: Array<{ product_id: string; price_at_purchase: number; quantity: number }>,
    shippingDetails: Record<string, any>,
) {
    // Calculate total amount from items
    const totalAmount = items.reduce(
        (sum, item) => sum + item.price_at_purchase * item.quantity,
        0,
    );

    // 1. Insert the order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: userId,
            total_amount: totalAmount,
            payment_status: "pending",
            order_status: "processing",
            shipping_details: shippingDetails,
        })
        .select()
        .single();

    if (orderError || !order) {
        return { data: null, error: orderError };
    }

    // 2. Insert order items linked to this order
    const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        price_at_purchase: item.price_at_purchase,
        quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) {
        return { data: order, error: itemsError };
    }

    // 3. Clear the user's cart after successful order creation
    await clearCart(userId);

    return { data: order, error: null };
}
