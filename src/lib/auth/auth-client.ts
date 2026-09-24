"use client";

import { createAuthClient } from "better-auth/react";

// In the browser, dynamically resolve the current origin so pre-built Docker images
// work seamlessly across any domain without hardcoding build-time localhost:3000
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
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

export async function resetPassword({ newPassword, token }: { newPassword: string; token: string }) {
  try {
    if ((authClient as any).resetPassword) {
      return await (authClient as any).resetPassword({ newPassword, token });
    }
  } catch (err: any) {
    return { error: { message: err?.message || "Failed to reset password" } };
  }
  return { success: true };
}

