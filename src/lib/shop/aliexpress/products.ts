/* eslint-disable @typescript-eslint/no-explicit-any -- réponses AliExpress non typées, normalisées ci-dessous */
import { callMethod } from "./client";
import { computePrice } from "@/lib/shop/pricing";

/** Extrait l'identifiant produit d'une URL AliExpress (ou accepte l'identifiant seul). */
export function parseProductId(input: string): string | null {
  const s = input.trim();
  if (/^\d{8,20}$/.test(s)) return s;
  const m = s.match(/\/item\/(\d{8,20})\.html/) ?? s.match(/[?&](?:productId|itemId)=(\d{8,20})/);
  return m ? m[1] : null;
}

const toCents = (v: unknown) => Math.round(parseFloat(String(v ?? "0").replace(",", ".")) * 100) || 0;
// Les listes AliExpress arrivent parfois enveloppées : { xxx_d_t_o: [...] }
const list = <T>(v: unknown): T[] => {
  if (Array.isArray(v)) return v as T[];
  if (v && typeof v === "object") {
    const inner = Object.values(v as Record<string, unknown>)[0];
    return Array.isArray(inner) ? (inner as T[]) : inner ? [inner as T] : [];
  }
  return [];
};

export interface ImportedVariant {
  aeSkuId: string;
  aeSkuAttr: string;
  label: string;
  shipFrom?: string; // entrepôt d'expédition (Chine, Allemagne, France…)
  productCents: number;
  stock: number;
  image?: string;
}

export interface ImportedProduct {
  productId: string;
  url: string;
  title: string;
  descriptionHtml: string;
  images: string[];
  variants: ImportedVariant[];
}

/** Fiche produit complète, prix en EUR, livrable en France. Méthode : aliexpress.ds.product.get */
export async function fetchProduct(productId: string, accessToken: string): Promise<ImportedProduct> {
  const res = await callMethod<Record<string, any>>("aliexpress.ds.product.get", accessToken, {
    product_id: productId,
    ship_to_country: "FR",
    target_currency: "EUR",
    target_language: "FR",
  });
  const r = res.aliexpress_ds_product_get_response?.result;
  if (!r) throw new Error("Produit introuvable ou non disponible en dropshipping vers la France");

  const base = r.ae_item_base_info_dto ?? {};
  const images = String(r.ae_multimedia_info_dto?.image_urls ?? "")
    .split(";")
    .map((u: string) => u.trim())
    .filter(Boolean);

  const variants = list<Record<string, any>>(r.ae_item_sku_info_dtos).map((sku) => {
    const props = list<Record<string, any>>(sku.ae_sku_property_dtos);
    const valueOf = (p: Record<string, any>) => String(p.property_value_definition_name || p.sku_property_value || "");
    // Propriété "Expédié depuis" (id 200007763 chez AliExpress) : on la sépare du libellé
    const shipProp = props.find(
      (p) => String(p.sku_property_id) === "200007763" || /ship|exp[ée]di|envoy|origine/i.test(String(p.sku_property_name ?? "")),
    );
    const shipFrom = shipProp ? valueOf(shipProp) : undefined;
    const label =
      props
        .filter((p) => p !== shipProp)
        .map(valueOf)
        .filter(Boolean)
        .join(" / ") || "Standard";
    const image = props.find((p) => p.sku_image)?.sku_image as string | undefined;
    return {
      aeSkuId: String(sku.sku_id ?? ""),
      aeSkuAttr: String(sku.sku_attr ?? sku.id ?? ""),
      label,
      shipFrom,
      productCents: toCents(sku.offer_sale_price ?? sku.sku_price),
      stock: Number(sku.sku_available_stock ?? sku.ipm_sku_stock ?? 0),
      image,
    };
  });

  return {
    productId,
    url: `https://fr.aliexpress.com/item/${productId}.html`,
    title: String(base.subject ?? ""),
    descriptionHtml: String(base.detail ?? ""),
    images,
    variants,
  };
}

export interface DeliveryOption {
  code: string; // logistics_service_name à renvoyer à la commande
  name: string;
  feeCents: number;
  minDays?: number;
  maxDays?: number;
}

/** Options de livraison vers la France pour un SKU. Méthode : aliexpress.ds.freight.query */
export async function fetchDeliveryOptions(
  productId: string,
  skuId: string,
  accessToken: string,
): Promise<DeliveryOption[]> {
  const res = await callMethod<Record<string, any>>("aliexpress.ds.freight.query", accessToken, {
    queryDeliveryReq: {
      productId,
      selectedSkuId: skuId,
      quantity: 1,
      shipToCountry: "FR",
      currency: "EUR",
      language: "fr_FR",
      locale: "fr_FR",
    },
  });
  const opts = list<Record<string, any>>(res.aliexpress_ds_freight_query_response?.result?.delivery_options);
  return opts.map((o) => ({
    code: String(o.code ?? o.service_name ?? ""),
    name: String(o.company ?? o.shipping_company ?? o.code ?? ""),
    feeCents: o.free_shipping === true || o.free_shipping === "true" ? 0 : Number(o.shipping_fee_cent ?? 0),
    minDays: o.min_delivery_days ? Number(o.min_delivery_days) : undefined,
    maxDays: o.max_delivery_days ? Number(o.max_delivery_days) : undefined,
  }));
}

/**
 * Aperçu d'import pour l'admin : fiche + meilleure livraison (la moins chère, puis la plus rapide)
 * + prix de vente conseillé par variante. Rien n'est enregistré ici.
 */
export async function buildImportPreview(input: string, accessToken: string, coefficient?: number) {
  const productId = parseProductId(input);
  if (!productId) throw new Error("URL ou identifiant AliExpress non reconnu");

  const product = await fetchProduct(productId, accessToken);
  const firstSku = product.variants[0]?.aeSkuId ?? "";
  const delivery = firstSku ? await fetchDeliveryOptions(productId, firstSku, accessToken).catch(() => []) : [];
  const best = [...delivery].sort((a, b) => a.feeCents - b.feeCents || (a.maxDays ?? 99) - (b.maxDays ?? 99))[0];

  return {
    ...product,
    delivery: { options: delivery, selected: best ?? null },
    variants: product.variants.map((v) => ({
      ...v,
      pricing: computePrice({ productCents: v.productCents, shippingCents: best?.feeCents ?? 0, coefficient }),
    })),
  };
}
