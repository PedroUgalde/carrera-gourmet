/** Mock food photos for vendors without a custom image (Unsplash, free to use). */
export const MOCK_VENDOR_IMAGES = [
  "https://images.unsplash.com/photo-1565299585323-38174c4a1e7c?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1613514785949-d1550775989c?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618046368034-d55f20408220?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1550547622-a9226c5ae518?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&h=600&fit=crop",
  "https://images.unsplash.com/photo-1625944525537-42f498a70791?w=900&h=600&fit=crop",
] as const;

export function getVendorImageUrl(
  imageUrl: string | null | undefined,
  fallbackIndex = 0
): string {
  if (imageUrl?.trim()) return imageUrl.trim();
  const index = Math.abs(fallbackIndex) % MOCK_VENDOR_IMAGES.length;
  return MOCK_VENDOR_IMAGES[index];
}
