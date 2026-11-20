import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-info";
import { SERVICES } from "@/lib/services";
import { PUBLISHED_CITIES } from "@/lib/cities";
import { getPublishedProducts } from "@/lib/shop/catalog";

const LAST_MODIFIED = "2026-11-20";

export const dynamic = "force-dynamic";

const corePages: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/mecanique", priority: 0.9 },
  { path: "/tarifs", priority: 0.9 },
  { path: "/reprogrammation", priority: 0.8 },
  { path: "/contact", priority: 0.7 },
  { path: "/faq", priority: 0.6 },
  { path: "/pieces", priority: 0.7 },
  { path: "/accompagnement", priority: 0.7 },
  { path: "/boutique", priority: 0.6 },
  { path: "/livraison-retours", priority: 0.3 },
  { path: "/cgv", priority: 0.3 },
  { path: "/cgu", priority: 0.3 },
  { path: "/mentions-legales", priority: 0.3 },
  { path: "/politique-confidentialite", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublishedProducts();
  const pages = [
    ...corePages,
    ...SERVICES.map((s) => ({ path: `/${s.slug}`, priority: 0.8 })),
    ...PUBLISHED_CITIES.map((c) => ({ path: `/${c.slug}`, priority: 0.7 })),
  ];
  const staticPages = pages.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(LAST_MODIFIED),
    changeFrequency: path === "" || path === "/boutique" ? ("weekly" as const) : ("monthly" as const),
    priority,
  }));
  const productPages = products.map((product) => ({
    url: `${SITE_URL}/boutique/${product.slug}`,
    lastModified: new Date(LAST_MODIFIED),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticPages, ...productPages];
}
