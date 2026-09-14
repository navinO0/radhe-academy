import { createId } from "@paralleldrive/cuid2";
import path from "path";

export interface FileValidationConfig {
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

export const DEFAULT_UPLOAD_CONFIG: FileValidationConfig = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".pdf"],
};

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
}

/**
 * Sanitize a user-provided filename to prevent directory traversal or control character injection.
 */
export function sanitizeFilename(filename: string): string {
  // 1. Extract basename to remove any path elements
  const basename = path.basename(filename);

  // 2. Remove null bytes and control characters
  const cleaned = basename.replace(/[\x00-\x1f\x80-\x9f]/g, "");

  // 3. Remove relative path traversals
  const noTraversal = cleaned.replace(/\.\.+[/\\]/g, "");

  // 4. Strip dangerous characters, keeping alphanumeric, dots, hyphens, and underscores
  const safeName = noTraversal.replace(/[^a-zA-Z0-9._-]/g, "_");

  // 5. If empty or dot-only, generate a fallback
  if (!safeName || safeName === "." || safeName === "..") {
    return `file_${createId()}`;
  }

  return safeName;
}

/**
 * Generate a cryptographically random, collision-safe storage key for an uploaded file.
 */
export function generateSafeStorageKey(originalFilename: string, prefix = "uploads"): string {
  const ext = path.extname(originalFilename).toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9.]/g, "");
  const uniqueId = createId();
  return `${prefix}/${uniqueId}${safeExt}`;
}

/**
 * Validate an incoming file before storage.
 */
export function validateUploadedFile(
  file: { name: string; size: number; type: string },
  config: FileValidationConfig = DEFAULT_UPLOAD_CONFIG
): FileValidationResult {
  const {
    maxSizeBytes = DEFAULT_UPLOAD_CONFIG.maxSizeBytes!,
    allowedMimeTypes = DEFAULT_UPLOAD_CONFIG.allowedMimeTypes!,
    allowedExtensions = DEFAULT_UPLOAD_CONFIG.allowedExtensions!,
  } = config;

  // 1. File size check
  if (!file.size || file.size <= 0) {
    return { valid: false, error: "File is empty" };
  }

  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    return { valid: false, error: `File exceeds maximum allowed size of ${maxMb}MB` };
  }

  // 2. MIME type check
  const mimeType = file.type.toLowerCase().trim();
  if (!allowedMimeTypes.includes(mimeType)) {
    return { valid: false, error: `MIME type "${mimeType}" is not allowed` };
  }

  // 3. Extension check
  const ext = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return { valid: false, error: `File extension "${ext}" is not allowed` };
  }

  const sanitizedFilename = sanitizeFilename(file.name);

  return {
    valid: true,
    sanitizedFilename,
  };
}

