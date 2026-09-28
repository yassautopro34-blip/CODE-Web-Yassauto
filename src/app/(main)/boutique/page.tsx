import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Truck, Wrench } from "lucide-react";
import { CATEGORY_LABELS, euros, getPublishedProducts, getVehicleFacets } from "@/lib/shop/catalog";
import { VehicleFilter } from "@/components/shop/vehicle-filter";
import { ShopBackdrop, TrustStrip } from "@/components/shop/shop-bits";
import { CartButton } from "@/components/shop/cart-button";

export const dynamic = "force-dynamic";

type Search = Promise<{ categorie?: string; marque?: string; modele?: string; annee?: string }>;

export default async function BoutiquePage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const [products, facets] = await Promise.all([
    getPublishedProducts({ category: sp.categorie, brand: sp.marque, model: sp.modele, year: sp.annee }),
    getVehicleFacets(),
  ]);

  const catLink = (value?: string) => {
    const q = new URLSearchParams();
    if (value) q.set("categorie", value);
    if (sp.marque) q.set("marque", sp.marque);
    if (sp.modele) q.set("modele", sp.modele);
    if (sp.annee) q.set("annee", sp.annee);
    return `/boutique${q.toString() ? `?${q}` : ""}`;
  };
  const pill = (active: boolean) =>
    `shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition ${
      active
        ? "bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20"
        : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
    }`;

  return (
    <div className="bg-brand-black min-h-screen relative overflow-hidden">
      <ShopBackdrop />

      {/* En-tête */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-8">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
                <span className="text-zinc-400 text-xs md:text-sm">Accessoires testés dans notre atelier</span>
              </div>
              <CartButton className="lg:hidden" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tight mb-4">
              Équipe ta voiture{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">comme un pro.</span>
            </h1>
            <p className="text-zinc-400 text-base md:text-lg max-w-xl">
              Écrans CarPlay / Android Auto, LED d&apos;ambiance et ciels étoilés. Livrés chez toi ou posés par nos
              mécaniciens à Gigean.
            </p>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="hidden lg:flex justify-end"><CartButton /></div>
            {facets.length > 0 && (
              <Suspense>
                <VehicleFilter facets={facets} />
              </Suspense>
            )}
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        <TrustStrip />

        {/* Catégories */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
          <Link href={catLink()} className={pill(!sp.categorie)}>Tout</Link>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <Link key={value} href={catLink(value)} className={pill(sp.categorie === value)}>{label}</Link>
          ))}
        </div>

        {sp.marque && (
          <p className="text-sm text-zinc-400">
            Compatible avec ta <span className="text-white font-bold">{sp.marque} {sp.modele}{sp.annee ? ` ${sp.annee}` : ""}</span>, plus les produits universels.
          </p>
        )}

        {products.length === 0 ? (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-10 text-center">
            <p className="text-white text-lg font-black mb-2">Rien pour l&apos;instant sur cette recherche.</p>
            <p className="text-zinc-400 text-sm mb-6">Dis-nous ce qu&apos;il te faut : on trouve et on pose.</p>
            <Link href="/pieces" className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold text-sm transition">
              Demander un accessoire <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/boutique/${p.slug}`}
                className="group bg-zinc-900/80 rounded-2xl lg:rounded-3xl overflow-hidden border border-zinc-800 hover:border-brand-red/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-red/10 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-square bg-white m-2 rounded-xl lg:rounded-2xl overflow-hidden">
                  {p.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.title} loading="lazy" className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-500" />
                  )}
                  {p.installOffer && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-brand-black/85 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full">
                      <Wrench size={12} className="text-brand-red" /> Pose à Gigean
                    </span>
                  )}
                </div>
                <div className="px-3 md:px-4 pb-4 pt-2 flex flex-col gap-2 flex-1">
                  <span className="text-[10px] md:text-xs font-bold text-brand-red uppercase tracking-wider">{CATEGORY_LABELS[p.category]}</span>
                  <h2 className="text-white font-bold text-sm md:text-base leading-snug line-clamp-2">{p.title}</h2>
                  {p.deliveryDaysMax && (
                    <span className="flex items-center gap-1 text-[11px] md:text-xs text-zinc-500">
                      <Truck size={13} /> Livré en {p.deliveryDaysMin ? `${p.deliveryDaysMin}–` : ""}{p.deliveryDaysMax} j · frais inclus
                    </span>
                  )}
                  <div className="mt-auto pt-2 flex items-end justify-between gap-2">
                    <p className="text-white font-black text-lg md:text-2xl leading-none">
                      {p.variants.length > 1 && <span className="block text-[10px] md:text-xs font-semibold text-zinc-500 mb-1">à partir de</span>}
                      {euros(p.minPriceTtcCents)}
                    </p>
                    <span className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-zinc-800 group-hover:bg-brand-red flex items-center justify-center transition">
                      <ArrowRight size={18} className="text-white" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
