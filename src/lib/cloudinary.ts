/**
 * Cloudinary CDN Configuration & Asset Mapping
 * Offloads static brochures and high-res logos to Cloudinary global edge CDN.
 */

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dzapdxkgc";

export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "demo_store";

export const CLOUDINARY_ASSETS = {
  logo: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1790452374/demo%20picts/radhe-vastraz-logo.png",
  boutiqueBrochure: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1790452383/demo%20picts/boutique-courses-brochure.jpg",
  fashionDesigningBrochure: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1790452391/demo%20picts/fashion-designing-brochure.jpg",
  fabricPaintingBrochure: "https://res.cloudinary.com/dzapdxkgc/image/upload/v1790452399/demo%20picts/fabric-painting-brochure.jpg",
} as const;

/**
 * Builds an optimized Cloudinary delivery URL with automatic format and WebP compression.
 */
export function getOptimizedCloudinaryUrl(
  pathOrUrl: string,
  options?: { width?: number; quality?: string | number }
): string {
  if (!pathOrUrl) return "";

  // If already a Cloudinary URL, inject optimization flags if needed
  if (pathOrUrl.includes("res.cloudinary.com")) {
    const quality = options?.quality ?? "auto";
    const width = options?.width ? `w_${options.width},` : "";
    return pathOrUrl.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_${quality},${width}`
    );
  }

  return pathOrUrl;
}

