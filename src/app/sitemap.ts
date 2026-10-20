import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://bawabmasr.example";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/jobs", priority: 0.9 },
  { path: "/how-it-works", priority: 0.6 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/faq", priority: 0.5 },
  { path: "/terms", priority: 0.3 },
  { path: "/privacy", priority: 0.3 },
  { path: "/safety", priority: 0.3 },
  { path: "/for-job-seekers", priority: 0.6 },
  { path: "/for-property-owners", priority: 0.6 },
  { path: "/login", priority: 0.4 },
  { path: "/register", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
    })
  );

  let jobEntries: MetadataRoute.Sitemap = [];
  try {
    const jobs = await prisma.job.findMany({
      where: { status: "PUBLISHED", reviewStatus: "APPROVED" },
      select: { slug: true, publishedAt: true, updatedAt: true },
    });
    jobEntries = jobs.map((job) => ({
      url: `${SITE_URL}/jobs/${job.slug}`,
      lastModified: job.publishedAt ?? job.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("[sitemap]", error);
  }

  return [...staticEntries, ...jobEntries];
}
