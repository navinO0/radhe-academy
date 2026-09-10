// Environment variable validation - fails fast at startup if required vars missing
import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Auth
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 chars"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),

  // App
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  ACADEMY_TIMEZONE: z.string().default("Asia/Kolkata"),
  ORGANIZATION_NAME: z.string().default("Raadhe Label Academy"),
  SEED_ADMIN_EMAIL: z.string().email().default("admin@raadhelabel.com"),
  SEED_ADMIN_PASSWORD: z.string().min(8).default("Admin@123456"),

  // Storage (optional in dev - falls back to local disk)
  STORAGE_PROVIDER: z.enum(["s3", "r2", "local"]).default("local"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_REGION: z.string().default("us-east-1"),

  // Email (optional in dev - falls back to console)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().default("noreply@raadhelabel.com"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(_env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;
export type Env = z.infer<typeof envSchema>;

