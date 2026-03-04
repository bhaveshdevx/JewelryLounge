/**
 * ============================================================
 * Supabase Storage — Bucket Helpers
 * ============================================================
 *
 * Helper functions for the two Supabase Storage buckets:
 *   1. `product-media`  → Product images/videos, organized by product ID
 *   2. `user-avatars`   → User profile pictures, organized by user ID
 *
 * Bucket folder structures:
 *   /product-media/{product-id}/{filename}
 *   /user-avatars/{user-id}/avatar.{ext}
 *
 * Import from "@/lib/supabase/storage" for all storage operations.
 *
 * Example usage:
 *   import { getProductMediaUrl, uploadAvatar } from "@/lib/supabase/storage";
 *
 *   const url = getProductMediaUrl("prod-123", "main-img.jpg");
 *   const { data, error } = await uploadAvatar(userId, file);
 * ============================================================
 */

import { supabase } from "./client";

// ---------------------------------------------------------------------------
// Bucket Names
// ---------------------------------------------------------------------------

const PRODUCT_MEDIA_BUCKET = "product-media";
const USER_AVATARS_BUCKET = "user-avatars";

// ============================================================
// Product Media — /product-media/{product-id}/{filename}
// ============================================================

/**
 * Get the public URL for a product media file.
 *
 * @param productId - The product UUID (folder name)
 * @param filename  - The file name (e.g. "main-img.jpg")
 * @returns         - The full public URL string
 *
 * @example
 *   const url = getProductMediaUrl("prod-123", "main-img.jpg");
 *   // → "https://xxx.supabase.co/storage/v1/object/public/product-media/prod-123/main-img.jpg"
 */
export function getProductMediaUrl(productId: string, filename: string): string {
    const { data } = supabase.storage
        .from(PRODUCT_MEDIA_BUCKET)
        .getPublicUrl(`${productId}/${filename}`);

    return data.publicUrl;
}

/**
 * List all media files for a specific product.
 *
 * @param productId - The product UUID (folder name)
 * @returns         - Supabase response with array of file objects
 *
 * @example
 *   const { data, error } = await listProductMedia("prod-123");
 *   // data → [{ name: "main-img.jpg", ... }, { name: "video-1.mp4", ... }]
 */
export async function listProductMedia(productId: string) {
    return supabase.storage
        .from(PRODUCT_MEDIA_BUCKET)
        .list(productId, {
            sortBy: { column: "created_at", order: "asc" },
        });
}

/**
 * Upload a media file for a product.
 *
 * @param productId - The product UUID (folder name)
 * @param file      - The File or Blob to upload
 * @param filename  - Optional custom filename (defaults to file.name)
 * @returns         - Supabase upload response
 *
 * @example
 *   const { data, error } = await uploadProductMedia("prod-123", imageFile);
 */
export async function uploadProductMedia(
    productId: string,
    file: File,
    filename?: string,
) {
    const name = filename || file.name;
    const path = `${productId}/${name}`;

    return supabase.storage
        .from(PRODUCT_MEDIA_BUCKET)
        .upload(path, file, {
            cacheControl: "3600",
            upsert: true, // Overwrite if same filename exists
        });
}

/**
 * Delete a specific media file from a product folder.
 *
 * @param productId - The product UUID (folder name)
 * @param filename  - The file to delete (e.g. "main-img.jpg")
 * @returns         - Supabase delete response
 *
 * @example
 *   const { data, error } = await deleteProductMedia("prod-123", "old-img.jpg");
 */
export async function deleteProductMedia(productId: string, filename: string) {
    return supabase.storage
        .from(PRODUCT_MEDIA_BUCKET)
        .remove([`${productId}/${filename}`]);
}

// ============================================================
// User Avatars — /user-avatars/{user-id}/avatar.{ext}
// ============================================================

/**
 * Get the public URL for a user's avatar.
 * Returns a URL regardless of whether the file exists.
 *
 * @param userId   - The user's auth UUID (folder name)
 * @param filename - Avatar filename (default: "avatar")
 * @returns        - The full public URL string
 *
 * @example
 *   const url = getAvatarUrl("user-uuid-123");
 */
export function getAvatarUrl(userId: string, filename: string = "avatar"): string {
    const { data } = supabase.storage
        .from(USER_AVATARS_BUCKET)
        .getPublicUrl(`${userId}/${filename}`);

    return data.publicUrl;
}

/**
 * Upload (or replace) a user's avatar image.
 * Automatically names the file based on extension.
 *
 * @param userId - The user's auth UUID (folder name)
 * @param file   - The image File to upload
 * @returns      - Supabase upload response with { data, error }
 *
 * @example
 *   const { data, error } = await uploadAvatar(userId, avatarFile);
 *   if (!error) {
 *     const url = getAvatarUrl(userId, data.path.split("/").pop());
 *   }
 */
export async function uploadAvatar(userId: string, file: File) {
    // Extract extension from the file name (e.g. ".jpg", ".png")
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/avatar.${ext}`;

    return supabase.storage
        .from(USER_AVATARS_BUCKET)
        .upload(path, file, {
            cacheControl: "3600",
            upsert: true, // Replace existing avatar
        });
}

/**
 * Delete a user's avatar image.
 *
 * @param userId   - The user's auth UUID (folder name)
 * @param filename - Avatar filename (default: "avatar")
 * @returns        - Supabase delete response
 *
 * @example
 *   const { data, error } = await deleteAvatar(userId);
 */
export async function deleteAvatar(userId: string, filename: string = "avatar") {
    // We need to list files first since we may not know the exact extension
    const { data: files } = await supabase.storage
        .from(USER_AVATARS_BUCKET)
        .list(userId);

    if (!files || files.length === 0) {
        return { data: null, error: null };
    }

    // Find avatar file (any extension)
    const avatarFile = files.find((f) => f.name.startsWith(filename));
    if (!avatarFile) {
        return { data: null, error: null };
    }

    return supabase.storage
        .from(USER_AVATARS_BUCKET)
        .remove([`${userId}/${avatarFile.name}`]);
}
