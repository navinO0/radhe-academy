import type { Metadata } from "next";
import { BrochureLanding } from "@/features/landing/components/BrochureLanding";

import { CLOUDINARY_ASSETS } from "@/lib/cloudinary";

// Static pre-rendering for ultra-fast Cloudflare CDN edge caching
export const dynamic = "force-static";
export const revalidate = 86400; // Cache on CDN for 24h with stale-while-revalidate

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
        url: CLOUDINARY_ASSETS.boutiqueBrochure,
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
    images: [CLOUDINARY_ASSETS.boutiqueBrochure],
  },
};

export default function HomePage() {
  return <BrochureLanding />;
}
