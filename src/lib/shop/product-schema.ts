import { z } from "zod";

export const variantInput = z.object({
  sku: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(200),
  aeSkuAttr: z.string().trim().max(500).optional().default(""),
  priceTtcCents: z.number().int().min(0).max(10_000_000),
  costCents: z.number().int().min(0).max(10_000_000),
  available: z.boolean().default(true),
  shipFrom: z.string().trim().max(60).optional(),
});

export const productInput = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug : minuscules, chiffres et tirets"),
  shortDescription: z.string().trim().max(300).default(""),
  description: z.string().max(20000).default(""),
  category: z.enum(["carplay", "compteur-digital", "volant", "led", "ciel-etoile", "accessoire", "universel"]),
  status: z.enum(["draft", "published", "unavailable"]).default("draft"),
  images: z.array(z.string().url()).max(20).default([]),
  videoUrl: z.string().url().or(z.literal("")).optional(),
  variants: z.array(variantInput).min(1).max(50),
  universal: z.boolean().default(false),
  fitments: z
    .array(
      z.object({
        brand: z.string().trim().min(1).max(60),
        model: z.string().trim().min(1).max(80),
        yearFrom: z.number().int().min(1980).max(2100).optional(),
        yearTo: z.number().int().min(1980).max(2100).optional(),
      }),
    )
    .max(200)
    .default([]),
  installOffer: z
    .object({ enabled: z.boolean(), priceTtcCents: z.number().int().min(0), durationMin: z.number().int().min(0) })
    .optional(),
  supplier: z.object({
    platform: z.literal("aliexpress").default("aliexpress"),
    productId: z.string().trim().min(1).max(40),
    url: z.string().url(),
    logisticsServiceName: z.string().max(120).optional(),
    deliveryDaysMin: z.number().int().optional(),
    deliveryDaysMax: z.number().int().optional(),
  }),
});

export type ProductInput = z.infer<typeof productInput>;

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
