import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { createId } from "@paralleldrive/cuid2";

// S3 & Tigris Configuration
const S3_ENDPOINT = process.env.S3_ENDPOINT || "https://t3.storageapi.dev";
const S3_REGION = process.env.S3_REGION || "auto";
const S3_BUCKET = process.env.S3_BUCKET || "balanced-duffel-s9so1bptd";
const S3_ACCESS_KEY_ID =
  process.env.S3_ACCESS_KEY_ID ||
  process.env.AWS_ACCESS_KEY_ID ||
  "tid__GbvXIIFlDThmwfnVywsERZzdoKfcZQQrUbTIELxXKRyAdfwmL";
const S3_SECRET_ACCESS_KEY =
  process.env.S3_SECRET_ACCESS_KEY ||
  process.env.AWS_SECRET_ACCESS_KEY ||
  "tsec_vtnaXQUZSfqH9-9mF5bteBNu9VP0dAXur4jADn8QQpwFVBhQKjPfTYgzgcFprti9gKcTdG";

let s3ClientInstance: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      endpoint: S3_ENDPOINT,
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }
  return s3ClientInstance;
}

export interface UploadAvatarResult {
  key: string;
  url: string;
  originalSize: number;
  optimizedSize: number;
  mimeType: string;
  dimensions: {
    width?: number;
    height?: number;
  };
}

/**
 * Optimizes a profile photo using sharp and uploads it to Tigris S3 storage.
 * - Auto-orients based on EXIF.
 * - Resizes to max 600x600 pixels (aspect-ratio preserved).
 * - Compresses into high-fidelity WebP (quality 85) without compromising visual quality.
 * - Strips sensitive EXIF metadata.
 * - Saves under structured student folder: academy/students/avatars/{studentIdentifier}/{uniqueId}.webp
 */
export async function uploadAndOptimizeStudentAvatar(
  imageBuffer: Buffer,
  studentIdentifier = "new"
): Promise<UploadAvatarResult> {
  const originalSize = imageBuffer.length;

  // Optimize image buffer with sharp
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  const optimizedBuffer = await image
    .rotate() // auto-orient
    .resize(600, 600, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 85,
      effort: 4,
    })
    .toBuffer();

  const optimizedMetadata = await sharp(optimizedBuffer).metadata();
  const fileId = createId();
  const safeIdentifier = studentIdentifier.replace(/[^a-zA-Z0-9_-]/g, "_");

  // Proper folder structure for academy students
  const storageKey = `academy/students/avatars/${safeIdentifier}/${fileId}.webp`;

  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: storageKey,
      Body: optimizedBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key: storageKey,
    url: `/api/academy/students/avatar?key=${encodeURIComponent(storageKey)}`,
    originalSize,
    optimizedSize: optimizedBuffer.length,
    mimeType: "image/webp",
    dimensions: {
      width: optimizedMetadata.width,
      height: optimizedMetadata.height,
    },
  };
}

/**
 * Retrieve an avatar object stream from S3 for authorized streaming
 */
export async function getStudentAvatarObject(key: string) {
  // Prevent path traversal
  if (!key || key.includes("..") || !key.startsWith("academy/students/avatars/")) {
    throw new Error("Invalid avatar storage key");
  }

  const client = getS3Client();
  return client.send(
    new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    })
  );
}

/**
 * Delete an avatar from S3
 */
export async function deleteStudentAvatar(key: string) {
  if (!key || key.includes("..") || !key.startsWith("academy/students/avatars/")) {
    return;
  }
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    })
  );
}

