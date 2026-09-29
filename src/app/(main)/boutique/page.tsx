import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, CarFront, CircleDot, Lightbulb, Package, Sparkles, Truck, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATEGORY_LABELS, euros, getPublishedProducts, getVehicleFacets } from "@/lib/shop/catalog";
import type { ProductCategory } from "@/lib/models/product";
import { VehicleFilter } from "@/components/shop/vehicle-filter";
import { ShopBackdrop, TrustStrip } from "@/components/shop/shop-bits";

export const dynamic = "force-dynamic";

type Search = Promise<{ section?: string; categorie?: string; famille?: string; marque?: string; modele?: string; annee?: string }>;

const CATEGORY_STORIES: Record<ProductCategory, { eyebrow: string; description: string; icon: LucideIcon }> = {
  carplay: {
    eyebrow: "Connectivité embarquée",
    description: "Trouve l'écran ou l'autoradio adapté à ta voiture.",
    icon: CarFront,
  },
  volant: {
    eyebrow: "Finition sur mesure",
    description: "Des volants personnalisés, choisis pour ton modèle.",
    icon: CircleDot,
  },
  led: {
    eyebrow: "Ambiance intérieure",
    description: "Des éclairages qui changent l'atmosphère à bord.",
    icon: Lightbulb,
  },
  "ciel-etoile": {
    eyebrow: "Personnalisation",
    description: "Un ciel étoilé installé et réglé dans notre atelier.",
    icon: Sparkles,
  },
  universel: {
    eyebrow: "Tous véhicules",
    description: "Écrans CarPlay et équipements qui s'adaptent à n'importe quelle voiture.",
    icon: Sparkles,
  },
  accessoire: {
    eyebrow: "Équipement auto",
    description: "Les accessoires utiles, sélectionnés par YassAuto.",
    icon: Package,
  },
};

export default async function BoutiquePage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const vehicleComplete = Boolean(sp.marque && sp.modele && sp.annee);
  const selectedCategory = sp.categorie && sp.categorie in CATEGORY_LABELS ? sp.categorie as ProductCategory : undefined;
  const legacyTouchscreenLink = sp.famille === "ecran-tactile";
  const resultCategory = selectedCategory ?? (legacyTouchscreenLink ? "carplay" : undefined);
  const showProducts = Boolean(resultCategory || vehicleComplete);
  const [products, facets] = await Promise.all([
    getPublishedProducts({ category: resultCategory, brand: sp.marque, model: sp.modele, year: sp.annee }),
    getVehicleFacets(),
  ]);

  const catLink = (category?: ProductCategory, section = sp.section) => {
    const query = new URLSearchParams();
    if (section) query.set("section", section);
    if (category) query.set("categorie", category);
    if (sp.marque) query.set("marque", sp.marque);
    if (sp.modele) query.set("modele", sp.modele);
    if (sp.annee) query.set("annee", sp.annee);
    return `/boutique${query.toString() ? `?${query}` : ""}`;
  };

  const productTiles = (Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((category) => {
    const categoryProducts = products.filter((product) => product.category === category);
    return {
      category,
      key: category,
      label: CATEGORY_LABELS[category],
      story: CATEGORY_STORIES[category],
      count: categoryProducts.length,
      cover: categoryProducts.find((product) => product.images[0])?.images[0],
      href: catLink(category),
      action: categoryProducts.length ? "Voir la sélection" : "Bientôt disponible",
      available: categoryProducts.length > 0,
    };
  });
  const accessoryCovers = productTiles
    .filter(({ category }) => category === "carplay" || category === "led" || category === "ciel-etoile")
    .flatMap((tile) => tile.cover ? [tile.cover] : [])
    .slice(0, 3);
  const accessoryTiles: {
    key: string;
    category?: ProductCategory;
    label: string;
    story: { eyebrow: string; description: string; icon: LucideIcon };
    count: number | null;
    cover?: string;
    covers?: string[];
    href: string;
    action: string;
    available: boolean;
  }[] = [
    ...productTiles.filter(({ category }) => category === "carplay"),
    ...productTiles.filter(({ category }) => category === "led"),
    ...productTiles.filter(({ category }) => category === "volant"),
    ...productTiles.filter(({ category }) => category === "ciel-etoile"),
    ...productTiles.filter(({ category }) => category === "accessoire"),
    ...productTiles.filter(({ category }) => category === "universel"),
  ];
  const accessoryCount = productTiles.reduce((sum, tile) => sum + tile.count, 0);
  const categoryTiles = sp.section === "accessoires"
    ? accessoryTiles
    : [
        {
          key: "pieces-auto",
          label: "Pièces de rechange",
          story: { eyebrow: "Neuf ou occasion", description: "Décris la pièce recherchée : on vérifie la référence et on te propose le bon choix.", icon: Package },
          count: null,
          cover: undefined,
          href: "/pieces",
          action: "Rechercher une pièce",
          available: true,
        },
        {
          key: "accessoires",
          label: "Accessoires auto",
          story: { eyebrow: "CarPlay · LED · personnalisation", description: "Choisis une famille puis retrouve le modèle et les variantes compatibles avec ta voiture.", icon: CarFront },
          count: accessoryCount,
          covers: accessoryCovers,
          href: "/boutique?section=accessoires",
          action: "Choisir un accessoire",
          available: accessoryCount > 0,
        },
      ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-black text-white">
      <ShopBackdrop />

      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 md:pt-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-end">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-brand-red" />
              Sélection YassAuto · Gigean
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] md:text-6xl">
              Le bon équipement,
              <span className="block text-brand-red">pour ta voiture.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
              Choisis une famille de produits ou retrouve directement ce qui est compatible avec ton véhicule.
              Les systèmes comme CCC et CIC restent indiqués sur chaque fiche.
            </p>
          </div>

          <div className="relative z-10">
            {facets.length > 0 && (
              <Suspense>
                <VehicleFilter facets={facets} />
              </Suspense>
            )}
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
        {sp.marque && !vehicleComplete && !selectedCategory && (
          <p className="-mt-4 text-sm text-zinc-400" role="status">
            Choisis le modèle puis l&apos;année exacte pour voir les produits compatibles.
          </p>
        )}

        {!showProducts ? (
          <section aria-labelledby="category-heading" className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <p className="text-xs font-bold uppercase text-brand-red">La boutique</p>
                <h2 id="category-heading" className="mt-1 text-2xl font-black md:text-3xl">Tu cherches quoi ?</h2>
              </div>
              <p className="max-w-md text-sm text-zinc-500">Des produits ciblés par véhicule, avec la pose possible à l&apos;atelier.</p>
            </div>

            <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${sp.section === "accessoires" ? "lg:grid-cols-4" : "lg:grid-cols-2"}`}>
              {categoryTiles.map(({ key, label, story, count, cover, covers, href, action, available }) => {
                const Icon = story.icon;
                return (
                  <Link
                    key={key}
                    href={href}
                    aria-label={count === null ? `${label}, recherche de pièce` : available ? `${label}, ${count} produit${count > 1 ? "s" : ""}` : `${label}, bientôt disponible`}
                    className="group relative isolate flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-red/60 hover:shadow-xl hover:shadow-brand-red/10 sm:min-h-72"
                  >
                    {covers && covers.length > 0 ? (
                      <div className="absolute inset-0 -z-20 grid grid-cols-3 overflow-hidden">
                        {covers.map((src, imageIndex) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={src} src={src} alt="" className={`h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-70 ${imageIndex === 1 ? "scale-110" : ""}`} />
                        ))}
                      </div>
                    ) : cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-70" />
                    )}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-black via-brand-black/65 to-brand-black/10" />
                    {!cover && <span className="absolute right-5 top-5 -z-10 text-white/[0.07]"><Icon size={104} strokeWidth={1} /></span>}

                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-brand-black/70 text-brand-red">
                        <Icon size={21} />
                      </span>
                      {count === null ? (
                        <span className="rounded-full border border-white/15 bg-brand-black/70 px-3 py-1 text-xs font-bold text-white">Recherche de pièce</span>
                      ) : available ? (
                        <span className="rounded-full border border-white/15 bg-brand-black/70 px-3 py-1 text-xs font-bold text-white">{count} produit{count > 1 ? "s" : ""}</span>
                      ) : (
                        <span className="rounded-full border border-white/15 bg-brand-black/70 px-3 py-1 text-xs font-bold text-zinc-300">Bientôt</span>
                      )}
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase text-zinc-300">{story.eyebrow}</p>
                      <h3 className="mt-1 text-xl font-black leading-tight md:text-2xl">{label}</h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-300">{story.description}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition group-hover:text-brand-red">
                        {action} <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : (
          <section aria-labelledby="results-heading" className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <Link href={sp.section === "accessoires" ? catLink(undefined, "accessoires") : catLink(undefined, "")} className="text-xs font-bold uppercase text-brand-red hover:text-white">← {sp.section === "accessoires" ? "Tous les accessoires" : "Toutes les familles"}</Link>
                <h2 id="results-heading" className="mt-2 text-2xl font-black md:text-3xl">
                  {vehicleComplete
                    ? `Pour ta ${sp.marque} ${sp.modele} ${sp.annee}`
                    : resultCategory ? CATEGORY_LABELS[resultCategory] : "La sélection compatible"}
                </h2>
                {vehicleComplete && <p className="mt-1 text-sm text-zinc-500">Les variantes CCC, CIC ou équivalentes sont précisées sur les fiches.</p>}
              </div>
              {vehicleComplete && resultCategory && <span className="text-sm text-zinc-500">{CATEGORY_LABELS[resultCategory]}</span>}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              <Link href="/pieces" className="shrink-0 rounded-full border border-zinc-700 px-4 py-2 text-xs font-bold text-zinc-400 transition hover:text-white">Pièces auto</Link>
              <Link href={sp.section === "accessoires" ? catLink(undefined, "accessoires") : catLink(undefined, "")} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${!selectedCategory ? "border-brand-red bg-brand-red text-white" : "border-zinc-700 text-zinc-400 hover:text-white"}`}>Toutes les catégories</Link>
              {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((category) => (
                <Link key={category} href={catLink(category, "accessoires")} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${selectedCategory === category ? "border-brand-red bg-brand-red text-white" : "border-zinc-700 text-zinc-400 hover:text-white"}`}>
                  {CATEGORY_LABELS[category]}
                </Link>
              ))}
            </div>

            {products.length === 0 ? (
              <div className="border-y border-zinc-800 py-12 text-center">
                <p className="text-xl font-black">Aucun produit ne correspond encore à cette sélection.</p>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">Envoie-nous la marque, le modèle et l&apos;année : on vérifiera le bon système avant de te conseiller.</p>
                <Link href="/pieces" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600">
                  Demander une pièce <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/boutique/${product.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 transition duration-300 hover:-translate-y-1 hover:border-brand-red/50 hover:shadow-xl hover:shadow-brand-red/10"
                  >
                    <div className="relative m-2 aspect-square overflow-hidden rounded-xl bg-white">
                      {product.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.title} loading="lazy" className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105" />
                      )}
                      {product.installOffer && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand-black/90 px-2 py-1 text-[10px] font-bold text-white"><Wrench size={12} className="text-brand-red" /> Pose à Gigean</span>}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 px-3 pb-4 pt-2 md:px-4">
                      <span className="text-[10px] font-bold uppercase text-brand-red">{CATEGORY_LABELS[product.category]}</span>
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white md:text-base">{product.title}</h3>
                      {product.deliveryDaysMax && <span className="mt-auto inline-flex items-center gap-1 text-[10px] text-zinc-500 md:text-xs"><Truck size={13} /> Livré en {product.deliveryDaysMin ? `${product.deliveryDaysMin}–` : ""}{product.deliveryDaysMax} j</span>}
                      <p className="pt-1 text-lg font-black text-white md:text-xl">
                        {product.variants.length > 1 && <span className="mb-1 block text-[10px] font-semibold text-zinc-500">À partir de</span>}
                        {euros(product.minPriceTtcCents)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        <TrustStrip />
      </div>
    </div>
  );
}