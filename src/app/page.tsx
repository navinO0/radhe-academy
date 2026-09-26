import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { BrochureLanding } from "@/features/landing/components/BrochureLanding";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Radhe Vastraz Academy | Boutique, Fashion Designing & Fabric Painting Courses",
  description:
    "Join Radhe Vastraz Academy in Hyderabad. Certified vocational courses in Boutique Management, Stitching, Fashion Designing, and Artisan Fabric Painting. Founder's Batch 40% OFF!",
  keywords: [
    "Radhe Vastraz Academy",
    "Boutique Management Course Hyderabad",
    "Fashion Designing Academy Hyderabad",
    "Fabric Painting Classes",
    "Pichwai Painting Course",
    "Kalamkari Painting",
    "Blouse Stitching Classes",
    "Maggam Work Essentials",
    "Aari Work Training",
    "Boutique Setup Guidance",
  ],
  openGraph: {
    title: "Radhe Vastraz Academy | Turn Your Passion for Fashion into a Career",
    description:
      "Explore 13 certified courses across Boutique Tailoring, Fashion Designing, and Artisan Fabric Painting with 40% Founder's Batch discount.",
    url: "https://academy.radhevastraz.in",
    siteName: "Radhe Vastraz Academy",
    images: [
      {
        url: "/images/brochures/boutique-courses-brochure.jpg",
        width: 1200,
        height: 630,
        alt: "Radhe Vastraz Boutique & Fashion Academy Courses",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Radhe Vastraz Academy | Boutique & Fashion Designing Courses",
    description:
      "Professional hands-on training in Boutique Management, Fashion Designing & Fabric Painting.",
    images: ["/images/brochures/boutique-courses-brochure.jpg"],
  },
};

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  let userSession: { userName?: string | null; userEmail?: string | null } | null = null;

  if (!session?.user) {
    redirect("/login");
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      userSession = {
        userName: session.user.name,
        userEmail: session.user.email,
      };
    }
  } catch {
    // If not authenticated or during public static pass, proceed as public visitor
    userSession = null;
  }

  redirect("/dashboard");
  return <BrochureLanding userSession={userSession} />;
}

