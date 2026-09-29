import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORY_LABELS, getPublishedProduct } from "@/lib/shop/catalog";
import { ProductView } from "@/components/shop/product-view";
import { ShopBackdrop } from "@/components/shop/shop-bits";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getPublishedProduct((await params).slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: `${product.title} | Boutique YASSAUTO`,
    description: product.shortDescription || product.descriptionText[0] || product.title,
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await getPublishedProduct((await params).slug);
  if (!product) notFound();
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
      </div>
    </div>
  );
}
