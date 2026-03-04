/**
 * ============================================================
 * Admin Products Page — Product Management
 * ============================================================
 *
 * Table of all products with search, toggle is_active, delete.
 * Add/Edit product via modal form.
 * Responsive: card list on mobile, table on desktop.
 * ============================================================
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
    getAllProducts,
    toggleProductActive,
    deleteProduct,
    upsertProduct,
} from "@/lib/supabase/admin-queries";
import { CURRENCY } from "@/lib/constants";
import { ProductFormModal } from "@/components/admin/product-form-modal";
import type { Product } from "@/types";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = useCallback(() => {
        setLoading(true);
        getAllProducts().then(({ data }) => {
            setProducts((data as Product[]) ?? []);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleToggleActive = async (productId: string, currentActive: boolean) => {
        await toggleProductActive(productId, !currentActive);
        setProducts((prev) =>
            prev.map((p) =>
                p.id === productId ? { ...p, is_active: !currentActive } : p,
            ),
        );
    };

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await deleteProduct(productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
    };

    const handleOpenAdd = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleSaved = (savedProduct: Product) => {
        if (editingProduct) {
            // Update existing product in list
            setProducts((prev) =>
                prev.map((p) => (p.id === savedProduct.id ? savedProduct : p)),
            );
        } else {
            // Add new product to the top of the list
            setProducts((prev) => [savedProduct, ...prev]);
        }
        setShowForm(false);
        setEditingProduct(null);
    };

    const filtered = search
        ? products.filter(
            (p) =>
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.description?.toLowerCase().includes(search.toLowerCase()),
        )
        : products;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white lg:hidden">
                    Products ({products.length})
                </h2>
                <p className="hidden lg:block text-sm text-slate-500">
                    {products.length} product{products.length !== 1 ? "s" : ""} total
                </p>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add Product
                </button>
            </div>

            {/* Search */}
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-sm h-10 lg:h-11 px-3 gap-2 lg:max-w-md">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                    search
                </span>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                />
            </div>

            {/* Product List */}
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm animate-pulse flex gap-3"
                        >
                            <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                            <div className="flex-1">
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-slate-400 gap-2">
                    <span className="material-symbols-outlined text-4xl">
                        inventory_2
                    </span>
                    <p className="text-sm">No products found</p>
                </div>
            ) : (
                <>
                    {/* ── Desktop Table (hidden on mobile) ── */}
                    <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Product</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Price</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Stock</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Status</th>
                                    <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        {/* Product */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden relative bg-slate-100">
                                                    {product.media_urls?.[0] && (
                                                        <Image
                                                            src={product.media_urls[0]}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="40px"
                                                        />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{product.title}</p>
                                                    <p className="text-xs text-slate-400 font-mono">#{product.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Price */}
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-primary">
                                                {CURRENCY}{(product.discount_price ?? product.selling_price).toLocaleString("en-IN")}
                                            </span>
                                            {product.discount_price && product.discount_price < product.selling_price && (
                                                <span className="text-xs text-slate-400 line-through ml-2">
                                                    {CURRENCY}{product.selling_price.toLocaleString("en-IN")}
                                                </span>
                                            )}
                                        </td>
                                        {/* Stock */}
                                        <td className="px-4 py-3">
                                            <span className={`text-sm font-medium ${product.stock_count > 0 ? "text-slate-700 dark:text-slate-300" : "text-red-500"}`}>
                                                {product.stock_count}
                                            </span>
                                        </td>
                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${product.is_active
                                                ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                                                : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? "bg-green-500" : "bg-slate-400"}`} />
                                                {product.is_active ? "Active" : "Hidden"}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleOpenEdit(product)}
                                                    className="p-1.5 rounded-lg text-blue-500 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 transition-colors"
                                                    title="Edit product"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(product.id, product.is_active)}
                                                    className={`p-1.5 rounded-lg transition-colors ${product.is_active
                                                        ? "text-green-500 bg-green-50 dark:bg-green-500/10 hover:bg-green-100"
                                                        : "text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                                                        }`}
                                                    title={product.is_active ? "Hide product" : "Show product"}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {product.is_active ? "visibility" : "visibility_off"}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 rounded-lg text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 transition-colors"
                                                    title="Delete product"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile Card List (hidden on desktop) ── */}
                    <div className="lg:hidden space-y-2">
                        {filtered.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm flex gap-3 items-center"
                            >
                                {/* Thumbnail */}
                                <div className="w-14 h-14 rounded-lg shrink-0 overflow-hidden relative bg-slate-100">
                                    {product.media_urls?.[0] && (
                                        <Image
                                            src={product.media_urls[0]}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                        />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {product.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs font-medium text-primary">
                                            {CURRENCY}
                                            {(product.discount_price ?? product.selling_price).toLocaleString("en-IN")}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            Stock: {product.stock_count}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    {/* Edit */}
                                    <button
                                        onClick={() => handleOpenEdit(product)}
                                        className="p-1.5 rounded-lg text-blue-500 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 transition-colors"
                                        title="Edit product"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                    {/* Toggle Active */}
                                    <button
                                        onClick={() =>
                                            handleToggleActive(product.id, product.is_active)
                                        }
                                        className={`p-1.5 rounded-lg transition-colors ${product.is_active
                                            ? "text-green-500 bg-green-50 dark:bg-green-500/10 hover:bg-green-100"
                                            : "text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                                            }`}
                                        title={product.is_active ? "Active — tap to hide" : "Hidden — tap to show"}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {product.is_active ? "visibility" : "visibility_off"}
                                        </span>
                                    </button>
                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-1.5 rounded-lg text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 transition-colors"
                                        title="Delete product"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Product Form Modal */}
            {showForm && (
                <ProductFormModal
                    product={editingProduct}
                    onClose={() => { setShowForm(false); setEditingProduct(null); }}
                    onSaved={handleSaved}
                    onSubmit={upsertProduct}
                />
            )}
        </div>
    );
}
