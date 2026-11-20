import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORY_LABELS, getPublishedProduct } from "@/lib/shop/catalog";
import { ProductView } from "@/components/shop/product-view";
import { JsonLd } from "@/components/seo/seo-bits";
import { ShopBackdrop } from "@/components/shop/shop-bits";
import { ADDRESS_LINE, SITE_URL } from "@/lib/site-info";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getPublishedProduct(slug);
  if (!product) return { title: "Produit introuvable", robots: { index: false, follow: false } };
  const title = `${product.title} | YASSAUTO Gigean`.slice(0, 60);
  const description = (product.shortDescription || product.descriptionText[0] || `${product.title}, disponible à Gigean avec pose possible.`).slice(0, 160);
  const metadata = buildPageMetadata({
    path: `/boutique/${slug}`,
    title,
    description,
    socialTitle: product.title,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: product.images.length ? product.images.slice(0, 4) : metadata.openGraph?.images,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await getPublishedProduct((await params).slug);
  if (!product) notFound();
  const offers = product.variants
    .filter((variant) => variant.available)
    .map((variant) => ({
      "@type": "Offer",
      url: `${SITE_URL}/boutique/${product.slug}`,
      price: (variant.priceTtcCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "AutoRepair", name: "YASSAUTO MKLF" },
    }));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription || product.descriptionText.join(" ").slice(0, 500),
    image: product.images,
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: "YASSAUTO" },
    category: CATEGORY_LABELS[product.category],
    offers: offers.length === 1 ? offers[0] : offers,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Boutique", item: `${SITE_URL}/boutique` },
      { "@type": "ListItem", position: 3, name: CATEGORY_LABELS[product.category], item: `${SITE_URL}/boutique?categorie=${product.category}` },
      { "@type": "ListItem", position: 4, name: product.title, item: `${SITE_URL}/boutique/${product.slug}` },
    ],
  };
  return (
    <div className="bg-brand-black min-h-screen relative overflow-hidden">
      <ShopBackdrop />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 md:pt-12 lg:pb-16">
        <div className="mb-5">
        <nav className="flex items-center gap-1 text-xs text-zinc-500 overflow-hidden whitespace-nowrap min-w-0">
          <Link href="/boutique" className="hover:text-white transition">Boutique</Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link href={`/boutique?categorie=${product.category}`} className="hover:text-white transition">{CATEGORY_LABELS[product.category]}</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-zinc-400 truncate">{product.title}</span>
        </nav>
        </div>
        <ProductView product={product} />
        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-400">
          <p className="font-bold text-white">Besoin de vérifier la compatibilité ?</p>
          <p className="mt-1 leading-relaxed">Avant de commander, appelle le garage avec ta plaque ou le modèle exact du véhicule. Retrait et conseil disponibles au {ADDRESS_LINE}.</p>
          <a href="tel:+33648380568" className="mt-3 inline-flex font-bold text-brand-red hover:text-red-400">Appeler le 06 48 38 05 68</a>
        </section>
      </div>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </div>
  );
}
