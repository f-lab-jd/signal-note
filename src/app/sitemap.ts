import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";

const STOCK_ROUTE_LIMIT = 5;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const stockRoutes = getAllSlugs().slice(0, STOCK_ROUTE_LIMIT).map((slug) => ({
    url: `${siteUrl}/stock/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...stockRoutes,
  ];
}
