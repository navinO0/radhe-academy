import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/common/cookie-banner";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://academy.radhevastraz.in";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Radhe Vastraz Academy | Premier Fashion Design & Boutique Training",
    template: "%s | Radhe Vastraz Academy",
  },
  description:
    "Radhe Vastraz Academy offers certified courses in Fashion Designing, Boutique Management, Pattern Making, Garment Construction, and Machine & Maggam Embroidery in Hyderabad.",
  keywords: [
    "Radhe Vastraz",
    "Radhe Vastraz Academy",
    "Fashion Designing Course Hyderabad",
    "Boutique Management Training",
    "Garment Construction Course",
    "Maggam Work Classes",
    "Machine Embroidery Course",
    "Pattern Making and Grading",
    "Fashion Illustration Course",
    "Boutique Training Institute",
  ],
  authors: [{ name: "Radhe Vastraz Academy", url: siteUrl }],
  creator: "Radhe Vastraz",
  publisher: "Radhe Vastraz Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Radhe Vastraz Academy",
    title: "Radhe Vastraz Academy | Fashion Design & Boutique Training",
    description:
      "Master fashion designing, garment construction, and boutique craftsmanship with expert certified mentors at Radhe Vastraz Academy.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Radhe Vastraz Academy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Radhe Vastraz Academy | Fashion Design & Boutique Training",
    description:
      "Certified vocational training in Fashion Designing, Boutique Management, and Maggam Work.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <CookieBanner />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}

