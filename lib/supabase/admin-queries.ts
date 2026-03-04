/**
 * ============================================================
 * Admin Queries — Server-Side Data Operations
 * ============================================================
 *
 * Functions for admin dashboard: manage products and orders.
 * Import from "@/lib/supabase/admin-queries".
 * ============================================================
 */

import { supabase } from "./client";
import type { Product, Order } from "@/types";

// ============================================================
// Products — Admin CRUD
// ============================================================

/** Fetch all products (including inactive) for the admin table */
export async function getAllProducts() {
    return supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });
}

/** Create or update a product */
export async function upsertProduct(
    product: Partial<Product> & { title: string; selling_price: number },
) {
    if (product.id) {
        // Update existing
        return supabase
            .from("products")
            .update(product)
            .eq("id", product.id)
            .select()
            .single();
    }

    // Insert new
    return supabase
        .from("products")
        .insert(product)
        .select()
        .single();
}

/** Toggle the is_active flag on a product */
export async function toggleProductActive(productId: string, isActive: boolean) {
    return supabase
        .from("products")
        .update({ is_active: isActive })
        .eq("id", productId)
        .select()
        .single();
}

/** Delete a product by ID */
export async function deleteProduct(productId: string) {
    return supabase.from("products").delete().eq("id", productId);
}

// ============================================================
// Orders — Admin Management
// ============================================================

/** Fetch all orders with user profile info, newest first */
export async function getAllOrders() {
    return supabase
        .from("orders")
        .select("*, profile:profiles(full_name, phone_number)")
        .order("created_at", { ascending: false });
}

/** Update order status */
export async function updateOrderStatus(
    orderId: string,
    orderStatus: string,
) {
    return supabase
        .from("orders")
        .update({ order_status: orderStatus })
        .eq("id", orderId)
        .select()
        .single();
}

/** Update payment status */
export async function updatePaymentStatus(
    orderId: string,
    paymentStatus: string,
) {
    return supabase
        .from("orders")
        .update({ payment_status: paymentStatus })
        .eq("id", orderId)
        .select()
        .single();
}

// ============================================================
// Dashboard Stats
// ============================================================

/** Get quick stats for the admin dashboard */
export async function getDashboardStats() {
    const [productsRes, ordersRes, pendingRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, total_amount"),
        supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("order_status", "processing"),
    ]);

    const totalProducts = productsRes.count ?? 0;
    const pendingOrders = pendingRes.count ?? 0;
    const totalRevenue = (ordersRes.data ?? []).reduce(
        (sum: number, o: any) => sum + (o.total_amount || 0),
        0,
    );
    const totalOrders = ordersRes.data?.length ?? 0;

    return { totalProducts, totalOrders, pendingOrders, totalRevenue };
}
