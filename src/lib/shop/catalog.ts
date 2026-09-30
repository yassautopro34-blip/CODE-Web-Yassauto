import { connectToMongoDB } from "@/lib/db";
import Product, { ProductCategory } from "@/lib/models/product";

/** Produit tel qu'envoyé aux pages publiques (sans coût fournisseur ni marge). */
export interface PublicProduct {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  descriptionText: string[];
  category: ProductCategory;
  images: string[];
  videoUrl?: string;
  variants: { sku: string; label: string; priceTtcCents: number; available: boolean }[];
  universal: boolean;
  fitments: { brand: string; model: string; yearFrom?: number; yearTo?: number }[];
  installOffer?: { priceTtcCents: number; durationMin: number };
  deliveryDaysMin?: number;
  deliveryDaysMax?: number;
  minPriceTtcCents: number;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  carplay: "Écrans CarPlay / Android Auto",
  "compteur-digital": "Compteurs digitaux",
  volant: "Volants personnalisés",
  led: "Bandes LED intérieures",
  "ciel-etoile": "Ciel étoilé",
  accessoire: "Accessoires",
  universel: "Universel",
};

/** Retire les codes d'autoradio et de génération pour regrouper une même gamme de modèle. */
export function vehicleModelFamily(model: string): string {
  const normalized = model
    .replace(/\b(?:CCC|CIC|NBT(?:\s*EVO)?|MIB\s*[23]?|RNS\s*\d*|RCD\s*\d*)\b/gi, "")
    .replace(/\b(?:E\d{2}|F\d{2}|G\d{2}|W\d{3}|B\d{1,2})\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\s*[/|,]\s*$/, "")
    .trim();
  return normalized || model.trim();
}

/** Transforme la description HTML importée en paragraphes de texte (pas de HTML injecté sur le site). */
export function htmlToParagraphs(html: string): string[] {
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&([a-z])(acute|grave|circ|uml|cedil);/gi, (_m, l: string, a: string) => {
      const map: Record<string, string> = { acute: "́", grave: "̀", circ: "̂", uml: "̈", cedil: "̧" };
      return (l + map[a.toLowerCase()]).normalize("NFC");
    });
  return text
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 1)
    .slice(0, 80);
}

type Doc = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function toPublic(p: Doc): PublicProduct {
  const variants = (p.variants ?? []).map((v: Doc) => ({
    sku: String(v.sku),
    label: String(v.label),
    priceTtcCents: Number(v.priceTtcCents),
    available: v.available !== false,
  }));
  const prices = variants.filter((v: { available: boolean }) => v.available).map((v: { priceTtcCents: number }) => v.priceTtcCents);
  return {
    id: String(p._id),
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription ?? "",
    descriptionText: htmlToParagraphs(p.description ?? ""),
    category: p.category,
    images: p.images ?? [],
    videoUrl: p.videoUrl || undefined,
    variants,
    universal: !!p.universal,
    fitments: (p.fitments ?? []).map((f: Doc) => ({ brand: f.brand, model: f.model, yearFrom: f.yearFrom, yearTo: f.yearTo })),
    installOffer: p.installOffer?.enabled
      ? { priceTtcCents: p.installOffer.priceTtcCents, durationMin: p.installOffer.durationMin }
      : undefined,
    deliveryDaysMin: p.supplier?.deliveryDaysMin,
    deliveryDaysMax: p.supplier?.deliveryDaysMax,
    minPriceTtcCents: prices.length ? Math.min(...prices) : 0,
  };
}

// --- Mode démo (développement uniquement) : si la base ne répond pas en local, on affiche des
// produits d'exemple pour pouvoir travailler le design. Jamais utilisé en production.
const DEMO_PRODUCTS: PublicProduct[] = [
  {
    id: "demo-1",
    slug: "demo-ecran-carplay-bmw-x3",
    title: "Écran tactile 10,25\" CarPlay & Android Auto sans fil pour BMW X3 / X4",
    shortDescription: "Remplace l'écran d'origine, garde les commandes au volant et la caméra de recul.",
    descriptionText: ["Écran 1920×720 IPS, CarPlay et Android Auto sans fil.", "• Compatible systèmes CIC et NBT", "• Installation plug & play, sans découpe"],
    category: "carplay",
    images: ["/img1.jpeg", "/img2.jpeg", "/img3.jpeg"],
    variants: [
      { sku: "d1", label: "10,25\" NBT", priceTtcCents: 49690, available: true },
      { sku: "d2", label: "10,25\" CIC", priceTtcCents: 49690, available: true },
      { sku: "d3", label: "12,3\" NBT", priceTtcCents: 54190, available: true },
      { sku: "d4", label: "12,3\" CIC", priceTtcCents: 54190, available: false },
    ],
    universal: false,
    fitments: [{ brand: "BMW", model: "X3 F25", yearFrom: 2011, yearTo: 2017 }, { brand: "BMW", model: "X4 F26", yearFrom: 2014, yearTo: 2018 }],
    installOffer: { priceTtcCents: 12000, durationMin: 120 },
    deliveryDaysMin: 8,
    deliveryDaysMax: 15,
    minPriceTtcCents: 49690,
  },
  {
    id: "demo-2",
    slug: "demo-kit-led-ambiance",
    title: "Kit 4 bandes LED d'ambiance RGB pilotées par application",
    shortDescription: "Éclairage d'habitacle 16 millions de couleurs, synchronisé à la musique.",
    descriptionText: ["Alimentation USB ou allume-cigare, pose sans outil."],
    category: "led",
    images: ["/img4.jpeg"],
    variants: [{ sku: "l1", label: "4 bandes USB", priceTtcCents: 3990, available: true }],
    universal: true,
    fitments: [],
    deliveryDaysMin: 7,
    deliveryDaysMax: 12,
    minPriceTtcCents: 3990,
  },
  {
    id: "demo-3",
    slug: "demo-ciel-etoile",
    title: "Ciel étoilé fibre optique 450 points avec étoiles filantes",
    shortDescription: "L'effet Rolls-Royce dans ton habitacle.",
    descriptionText: [],
    category: "ciel-etoile",
    images: ["/img2.jpeg"],
    variants: [{ sku: "c1", label: "450 fibres", priceTtcCents: 18990, available: true }],
    universal: true,
    fitments: [],
    installOffer: { priceTtcCents: 25000, durationMin: 360 },
    deliveryDaysMin: 10,
    deliveryDaysMax: 18,
    minPriceTtcCents: 18990,
  },
];

async function devFallback<T>(work: () => Promise<T>, demo: () => T): Promise<T> {
  if (process.env.NODE_ENV === "production") return work();
  try {
    return await Promise.race([
      work(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000)),
    ]);
  } catch (error) {
    console.warn("[boutique] Base indisponible en local : produits de démonstration affichés.", (error as Error).message);
    return demo();
  }
}

type ProductFilters = { category?: string; brand?: string; model?: string; year?: string };

export async function getPublishedProducts(filters: ProductFilters = {}) {
  return devFallback(
    () => queryPublishedProducts(filters),
    () =>
      DEMO_PRODUCTS.filter((product) => {
        const isUniversal = product.universal || product.category === "universel";
        if (filters.category === "universel") return isUniversal;
        if (filters.category && product.category !== filters.category) return false;
        if (!filters.brand) return true;
        if (isUniversal) return false; // les produits universels n'apparaissent que dans leur catégorie
        return product.fitments.some((fitment) => {
          if (fitment.brand.toLocaleLowerCase("fr") !== filters.brand?.toLocaleLowerCase("fr")) return false;
          if (filters.model && vehicleModelFamily(fitment.model).toLocaleLowerCase("fr") !== filters.model.toLocaleLowerCase("fr")) return false;
          const year = Number(filters.year);
          return !filters.year || !Number.isInteger(year) ||
            ((!fitment.yearFrom || year >= fitment.yearFrom) && (!fitment.yearTo || year <= fitment.yearTo));
        });
      }),
  );
}

async function queryPublishedProducts(filters: ProductFilters) {
  await connectToMongoDB();
  const query: Doc = { status: "published" };
  // Catégorie "Universel" : produits universels, sans filtre véhicule
  if (filters.category === "universel") {
    query.$or = [{ category: "universel" }, { universal: true }];
    const docs = await Product.find(query).sort({ updatedAt: -1 }).lean();
    return docs.map(toPublic);
  }
  if (filters.category && filters.category in CATEGORY_LABELS) query.category = filters.category;
  if (filters.brand) {
    const vehicle: Doc = { brand: new RegExp(`^${escape(filters.brand)}$`, "i") };
    if (filters.model) vehicle.model = new RegExp(`^${escape(filters.model)}(?:\\s|$)`, "i");
    const year = Number(filters.year);
    if (filters.model && Number.isInteger(year) && year >= 1980 && year <= 2100) {
      vehicle.$or = [
        { yearFrom: { $lte: year }, yearTo: { $gte: year } },
        { yearFrom: { $lte: year }, yearTo: { $exists: false } },
        { yearFrom: { $exists: false }, yearTo: { $gte: year } },
        { yearFrom: { $exists: false }, yearTo: { $exists: false } },
      ];
    }
    // Recherche par véhicule : uniquement les produits réellement compatibles (pas les universels)
    query.universal = { $ne: true };
    query.category = query.category ?? { $ne: "universel" };
    query.fitments = { $elemMatch: vehicle };
  }
  const docs = await Product.find(query).sort({ updatedAt: -1 }).lean();
  return docs.map(toPublic);
}

export async function getPublishedProduct(slug: string) {
  return devFallback(
    () => queryPublishedProduct(slug),
    () => DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null,
  );
}

async function queryPublishedProduct(slug: string) {
  await connectToMongoDB();
  const doc = await Product.findOne({ slug, status: "published" }).lean();
  return doc ? toPublic(doc) : null;
}

/** Marques, modèles et années présents dans les compatibilités des produits en ligne. */
export async function getVehicleFacets() {
  return devFallback(queryVehicleFacets, () => [
    { brand: "BMW", models: [{ model: "X3", years: [2011, 2012, 2013, 2014, 2015, 2016, 2017] }, { model: "X4", years: [2014, 2015, 2016, 2017, 2018] }] },
  ]);
}

async function queryVehicleFacets() {
  await connectToMongoDB();
  const rows = await Product.aggregate([
    { $match: { status: "published" } },
    { $unwind: "$fitments" },
    {
      $group: {
        _id: {
          brand: "$fitments.brand",
          model: "$fitments.model",
          yearFrom: "$fitments.yearFrom",
          yearTo: "$fitments.yearTo",
        },
      },
    },
  ]);
  const map = new Map<string, Map<string, { model: string; years: Set<number> }>>();
  for (const r of rows) {
    const { brand, model, yearFrom, yearTo } = r._id as {
      brand: string;
      model: string;
      yearFrom?: number;
      yearTo?: number;
    };
    if (!brand) continue;
    if (!map.has(brand)) map.set(brand, new Map());
    if (!model) continue;
    const models = map.get(brand)!;
    const family = vehicleModelFamily(model);
    const modelKey = family.toLocaleLowerCase("fr");
    if (!models.has(modelKey)) models.set(modelKey, { model: family, years: new Set() });
    const years = models.get(modelKey)!.years;
    const first = Number(yearFrom);
    const last = Number(yearTo);
    if (Number.isInteger(first) && Number.isInteger(last)) {
      for (let year = Math.min(first, last); year <= Math.max(first, last); year++) years.add(year);
    } else if (Number.isInteger(first)) {
      for (let year = first; year <= new Date().getFullYear(); year++) years.add(year);
    } else if (Number.isInteger(last)) {
      years.add(last);
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "fr"))
    .map(([brand, models]) => ({
      brand,
      models: [...models.values()]
        .sort((a, b) => a.model.localeCompare(b.model, "fr"))
        .map(({ model, years }) => ({ model, years: [...years].sort((a, b) => a - b) })),
    }));
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const euros = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
