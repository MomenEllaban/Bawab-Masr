import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://bawabmasr.example";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/seeker/", "/employer/", "/admin/", "/verify-phone"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
