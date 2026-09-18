import type { MetadataRoute } from "next";

const publicRoutes = [
  "/",
  "/accompagnement",
  "/mecanique",
  "/pieces",
  "/reprogrammation",
  "/contact",
  "/faq",
  "/propos",
  "/mentions-legales",
  "/politique-confidentialite",
  "/cgu",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: `https://www.yassauto.fr${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}