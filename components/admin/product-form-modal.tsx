/**
 * ============================================================
 * Product Form Modal — Add / Edit Product
 * ============================================================
 *
 * Full-featured form for creating and editing products.
 * Fields: title, description, prices, category, stock, media URLs,
 * attributes (tags, material, color), and is_active toggle.
 * Supports direct image upload to Supabase Storage.
 * ============================================================
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { uploadProductMedia, getProductMediaUrl } from "@/lib/supabase/storage";
import type { Product } from "@/types";

interface ProductFormModalProps {
    /** Product to edit, or null for "add new" mode */
    product: Product | null;
    /** Close the modal */
    onClose: () => void;
    /** Called after successful save with the saved product */
    onSaved: (product: Product) => void;
    /** Save handler — calls upsertProduct */
    onSubmit: (data: Partial<Product> & { title: string; selling_price: number }) => Promise<{ data: any; error: any }>;
}

export function ProductFormModal({ product, onClose, onSaved, onSubmit }: ProductFormModalProps) {
    const isEdit = !!product;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [costPrice, setCostPrice] = useState(0);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [discountPrice, setDiscountPrice] = useState<string | number>("");
    const [categoryId, setCategoryId] = useState("");
    const [stockCount, setStockCount] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [newMediaUrl, setNewMediaUrl] = useState("");
    const [tags, setTags] = useState("");
    const [material, setMaterial] = useState("");
    const [color, setColor] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pre-fill form when editing
    useEffect(() => {
        if (product) {
            setTitle(product.title);
            setDescription(product.description || "");
            setCostPrice(product.cost_price || 0);
            setSellingPrice(product.selling_price);
            setDiscountPrice(product.discount_price ?? "");
            setCategoryId(product.category_id || "");
            setStockCount(product.stock_count || 0);
            setIsActive(product.is_active);
            setMediaUrls(product.media_urls || []);
            setTags(product.attributes?.tags?.join(", ") || "");
            setMaterial(product.attributes?.material || "");
            setColor(product.attributes?.color || "");
        }
    }, [product]);

    // ── Add media URL manually ──
    const handleAddMediaUrl = () => {
        const url = newMediaUrl.trim();
        if (url && !mediaUrls.includes(url)) {
            setMediaUrls((prev) => [...prev, url]);
            setNewMediaUrl("");
        }
    };

    const handleRemoveMediaUrl = (index: number) => {
        setMediaUrls((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Upload image file to Supabase Storage ──
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError(null);

        // We need a product ID for the storage path.
        // For new products, use a temp folder; for existing, use the product ID.
        const folderId = product?.id || `temp-${Date.now()}`;

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file type
                if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
                    setError(`"${file.name}" is not an image or video file`);
                    continue;
                }

                // Validate size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    setError(`"${file.name}" exceeds 10MB limit`);
                    continue;
                }

                // Generate unique filename
                const ext = file.name.split(".").pop() || "jpg";
                const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

                const { error: uploadError } = await uploadProductMedia(folderId, file, uniqueName);

                if (uploadError) {
                    setError(`Upload failed: ${uploadError.message}`);
                    continue;
                }

                // Get the public URL and add to media_urls
                const publicUrl = getProductMediaUrl(folderId, uniqueName);
                setMediaUrls((prev) => [...prev, publicUrl]);
            }
        } catch (err: any) {
            setError(`Upload error: ${err.message}`);
        } finally {
            setUploading(false);
            // Reset the file input so the same file can be selected again
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // ── Submit form ──
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Product title is required");
            return;
        }
        if (sellingPrice <= 0) {
            setError("Selling price must be greater than 0");
            return;
        }

        setSaving(true);

        const attributes: Record<string, any> = {};
        const parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
        if (parsedTags.length > 0) attributes.tags = parsedTags;
        if (material.trim()) attributes.material = material.trim();
        if (color.trim()) attributes.color = color.trim();

        const payload: Partial<Product> & { title: string; selling_price: number } = {
            title: title.trim(),
            description: description.trim(),
            cost_price: costPrice,
            selling_price: sellingPrice,
            discount_price: discountPrice === "" ? null : Number(discountPrice),
            category_id: categoryId || undefined,
            stock_count: stockCount,
            is_active: isActive,
            media_urls: mediaUrls,
            attributes,
        };

        if (isEdit && product) {
            payload.id = product.id;
        }

        const { data, error: saveError } = await onSubmit(payload);

        if (saveError) {
            setError(saveError.message || "Failed to save product");
            setSaving(false);
            return;
        }

        onSaved(data as Product);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {isEdit ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Product Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Gold Plated Kundan Choker"
                            className="w-full h-11 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Product description..."
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                    </div>

                    {/* Prices — 3 column grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                Cost Price (₹)
                            </label>
                            <input
                                type="number"
                                value={costPrice}
                                onChange={(e) => setCostPrice(Number(e.target.value))}
                                min={0}
                                className="w-full h-11 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                Selling Price (₹) *
                            </label>
                            <input
                                type="number"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(Number(e.target.value))}
                                min={1}
                                required
                                className="w-full h-11 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                Discount Price (₹)
                            </label>
                            <input
                                type="number"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                min={0}
                                placeholder="Optional"
                                className="w-full h-11 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    {/* Category + Stock — 2 column */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                Category ID
                            </label>
                            <input
                                type="text"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                placeholder="Category UUID (optional)"
                                className="w-full h-11 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                Stock Count
                            </label>
                            <input
                                type="number"
                                value={stockCount}
                                onChange={(e) => setStockCount(Number(e.target.value))}
                                min={0}
                                className="w-full h-11 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Active</p>
                            <p className="text-xs text-slate-500">Visible in the store</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={`relative w-12 h-7 rounded-full transition-colors ${isActive ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isActive ? "translate-x-5" : ""
                                    }`}
                            />
                        </button>
                    </div>

                    {/* ── Media Section — Upload + URL ── */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Product Images / Videos
                        </label>

                        {/* Image previews grid */}
                        {mediaUrls.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                {mediaUrls.map((url, i) => (
                                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        {url ? (
                                            url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                <video
                                                    src={url}
                                                    className="w-full h-full object-cover"
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                            ) : (
                                                <Image
                                                    src={url}
                                                    alt={`Media ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="120px"
                                                    unoptimized
                                                />
                                            )
                                        ) : null}
                                        {/* Remove overlay */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMediaUrl(i)}
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined text-white text-[24px]">delete</span>
                                        </button>
                                        {/* Index badge */}
                                        {i === 0 && (
                                            <span className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                                Hero
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload button */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                id="product-media-upload"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center justify-center gap-2 h-11 px-5 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                                        Upload Images
                                    </>
                                )}
                            </button>

                            {/* OR paste URL */}
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex gap-2 w-full">
                                    <input
                                        type="url"
                                        value={newMediaUrl}
                                        onChange={(e) => setNewMediaUrl(e.target.value)}
                                        placeholder="Or paste image/video URL... (e.g., .mp4, .jpg)"
                                        className="flex-1 h-11 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddMediaUrl();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddMediaUrl}
                                        className="px-3 h-11 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5">
                            First image becomes the hero/thumbnail. Max 10MB per file. Supports JPG, PNG, WebP, MP4.
                        </p>
                    </div>

                    {/* Attributes — Tags, Material, Color */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Attributes
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[10px] text-slate-400 mb-1">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="best-seller, new"
                                    className="w-full h-10 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-slate-400 mb-1">Material</label>
                                <input
                                    type="text"
                                    value={material}
                                    onChange={(e) => setMaterial(e.target.value)}
                                    placeholder="gold, silver, AD"
                                    className="w-full h-10 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-slate-400 mb-1">Color</label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="Rose Gold, Silver"
                                    className="w-full h-10 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-xs text-red-500 font-medium px-1">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || uploading}
                            className="flex-1 h-11 bg-primary text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : isEdit ? (
                                "Save Changes"
                            ) : (
                                "Create Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
