import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://academy.radhevastraz.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/academy/courses",
          "/privacy",
          "/terms",
          "/thank-you",
          "/login",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/academy/students/",
          "/academy/batches/",
          "/academy/attendance/",
          "/academy/fees/",
          "/academy/payments/",
          "/academy/receipts/",
          "/academy/reports/",
          "/settings/",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

