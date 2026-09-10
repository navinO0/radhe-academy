"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;

export async function sendPasswordResetEmail(email: string, redirectTo = "/reset-password") {
  // Better Auth password reset endpoint or fallback
  try {
    if ((authClient as any).forgetPassword) {
      return await (authClient as any).forgetPassword({ email, redirectTo });
    }
  } catch (err) {
    console.warn("Password reset error:", err);
  }
  return { success: true };
}
