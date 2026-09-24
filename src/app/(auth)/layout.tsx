import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Sign In",
  description: "Sign in to Radhe Vastraz Academy to access student management, courses, batches, and academy analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
