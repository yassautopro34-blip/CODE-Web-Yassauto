import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-info";
import { SERVICES } from "@/lib/services";
import { PUBLISHED_CITIES } from "@/lib/cities";

// Date de dernière modification réelle du contenu de chaque page (à mettre à jour quand la page change).
const LAST_MODIFIED = "2026-10-29";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    ...corePages,
    ...SERVICES.map((s) => ({ path: `/${s.slug}`, priority: 0.8 })),
    ...PUBLISHED_CITIES.map((c) => ({ path: `/${c.slug}`, priority: 0.7 })),
  ];
  return pages.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(LAST_MODIFIED),
    changeFrequency: path === "" || path === "/boutique" ? "weekly" : "monthly",
    priority,
  }));
}
