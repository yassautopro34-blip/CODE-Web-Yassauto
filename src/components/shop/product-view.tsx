"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, MapPin, PlayCircle, ShieldCheck, ShoppingBag, Truck, Wrench } from "lucide-react";
import type { PublicProduct } from "@/lib/shop/catalog";
import { useCart } from "./cart-context";

const euros = (cents: number) => (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function VideoPlayer({ url }: { url: string }) {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  if (yt) {
    return (
      <iframe
        className="w-full aspect-video rounded-2xl border border-zinc-800"
        src={`https://www.youtube-nocookie.com/embed/${yt[1]}`}
        title="Vidéo d'installation"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return <video className="w-full rounded-2xl border border-zinc-800" src={url} controls preload="metadata" />;
}

export function ProductView({ product }: { product: PublicProduct }) {
  const { add } = useCart();
  const firstAvailable = product.variants.find((v) => v.available) ?? product.variants[0];
  const [sku, setSku] = useState(firstAvailable?.sku ?? "");
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [install, setInstall] = useState(false);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.sku === sku) ?? firstAvailable;
  const installPrice = install && product.installOffer ? product.installOffer.priceTtcCents : 0;
  const total = ((variant?.priceTtcCents ?? 0) + installPrice) * qty;
  const images = product.images;
  const image = images[imageIndex];
  const step = (d: number) => setImageIndex((i) => (i + d + images.length) % images.length);

  const addToCart = () => {
    if (!variant?.available) return;
    add({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      image: images[0],
      sku: variant.sku,
      variantLabel: variant.label,
      unitPriceTtcCents: variant.priceTtcCents,
      quantity: qty,
      install: install && product.installOffer ? { priceTtcCents: product.installOffer.priceTtcCents } : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const renderAddButton = (compact = false) => (
    <button
      onClick={addToCart}
      disabled={!variant?.available}
      className={`flex items-center justify-center gap-2 bg-brand-red hover:bg-red-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white font-black rounded-xl transition-all shadow-lg shadow-brand-red/25 active:scale-[0.98] ${compact ? "px-5 py-3 text-sm" : "flex-1 py-4 text-base"}`}
    >
      {added ? <><Check size={20} /> Ajouté</> : !variant?.available ? "Indisponible" : <><ShoppingBag size={20} /> Ajouter au panier</>}
    </button>
  );

  return (
    <>
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-12">
        {/* Galerie */}
        <div className="lg:col-span-7 space-y-3 lg:sticky lg:top-24 self-start">
          <div className="relative aspect-square bg-white rounded-3xl overflow-hidden group">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={product.title} className="w-full h-full object-contain p-4" />
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => step(-1)} aria-label="Photo précédente" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-black/70 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition"><ChevronLeft size={20} /></button>
                <button onClick={() => step(1)} aria-label="Photo suivante" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-black/70 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition"><ChevronRight size={20} /></button>
                <span className="absolute bottom-3 right-3 bg-brand-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-full">{imageIndex + 1} / {images.length}</span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {images.map((src, i) => (
                <button key={src} onClick={() => setImageIndex(i)} className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden bg-white border-2 transition ${i === imageIndex ? "border-brand-red" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Achat */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            {product.videoUrl && (
              <a href="#video" className="inline-flex items-center gap-1.5 bg-brand-red/15 text-brand-red text-xs font-bold px-3 py-1.5 rounded-full hover:bg-brand-red/25 transition">
                <PlayCircle size={14} /> Vidéo d&apos;installation disponible
              </a>
            )}
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">{product.title}</h1>
            {product.shortDescription && <p className="text-zinc-400">{product.shortDescription}</p>}
          </div>

          <div className="flex items-end gap-3">
            <p className="text-4xl md:text-5xl font-black text-white tracking-tight">{euros(total)}</p>
            <p className="text-zinc-500 text-sm pb-1.5">TTC{qty > 1 ? ` · ${qty} articles` : ""}</p>
          </div>

          {product.variants.length > 1 && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-zinc-300">Modèle : <span className="text-white">{variant?.label}</span></p>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.sku}
                    disabled={!v.available}
                    onClick={() => setSku(v.sku)}
                    className={`text-left px-3 py-3 rounded-xl border transition ${v.sku === variant?.sku ? "border-brand-red bg-brand-red/10 ring-1 ring-brand-red" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"} ${!v.available ? "opacity-35 cursor-not-allowed" : ""}`}
                  >
                    <span className="block text-white text-sm font-semibold leading-snug">{v.label}</span>
                    <span className="block text-zinc-400 text-xs mt-1">{v.available ? euros(v.priceTtcCents) : "Épuisé"}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.installOffer && (
            <button
              onClick={() => setInstall((x) => !x)}
              className={`w-full text-left flex items-start gap-4 rounded-2xl p-4 border transition ${install ? "border-brand-red bg-gradient-to-br from-brand-red/15 to-orange-500/5" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"}`}
            >
              <span className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${install ? "bg-brand-red text-white" : "bg-zinc-800 text-brand-red"}`}><Wrench size={20} /></span>
              <span className="flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-white font-bold">Pose à l&apos;atelier de Gigean</span>
                  <span className="text-white font-black">+{euros(product.installOffer.priceTtcCents)}</span>
                </span>
                <span className="block text-zinc-400 text-sm mt-1">
                  Posé et testé par nos mécaniciens (environ {Math.max(1, Math.round((product.installOffer.durationMin / 60) * 10) / 10)} h). On t&apos;appelle dès que le colis arrive.
                </span>
              </span>
              <span className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center ${install ? "border-brand-red bg-brand-red" : "border-zinc-600"}`}>{install && <Check size={14} className="text-white" />}</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-14 text-white text-xl" aria-label="Moins">−</button>
              <span className="w-8 text-center text-white font-bold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(5, q + 1))} className="w-11 h-14 text-white text-xl" aria-label="Plus">+</button>
            </div>
            {renderAddButton()}
          </div>
          {added && (
            <Link href="/boutique/panier" className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-zinc-900 border border-zinc-800 rounded-xl py-3 hover:border-brand-red/50 transition">
              <Check size={16} className="text-emerald-400" /> Ajouté au panier — voir mon panier <ChevronRight size={16} />
            </Link>
          )}

          <ul className="divide-y divide-zinc-800 bg-zinc-900/70 border border-zinc-800 rounded-2xl">
            {product.deliveryDaysMax && (
              <li className="flex gap-3 p-4"><Truck size={20} className="text-brand-red shrink-0" /><span className="text-sm"><span className="block text-white font-semibold">Livraison à domicile incluse</span><span className="text-zinc-500">Reçu en {product.deliveryDaysMin ? `${product.deliveryDaysMin} à ` : ""}{product.deliveryDaysMax} jours, suivi par email</span></span></li>
            )}
            <li className="flex gap-3 p-4"><MapPin size={20} className="text-brand-red shrink-0" /><span className="text-sm"><span className="block text-white font-semibold">Retrait gratuit à Gigean</span><span className="text-zinc-500">7 rue André Marie Ampère, 34770 Gigean</span></span></li>
            <li className="flex gap-3 p-4"><ShieldCheck size={20} className="text-brand-red shrink-0" /><span className="text-sm"><span className="block text-white font-semibold">Garantie légale 2 ans</span><span className="text-zinc-500">Retour possible sous 14 jours</span></span></li>
          </ul>

          {(product.universal || product.fitments.length > 0) && (
            <div className="space-y-2">
              <p className="text-sm font-bold text-zinc-300">Compatibilité</p>
              {product.universal ? (
                <p className="text-zinc-400 text-sm">Universel : s&apos;adapte à tous les véhicules.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {product.fitments.map((f, i) => (
                    <span key={i} className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                      {f.brand} {f.model}{f.yearFrom ? ` · ${f.yearFrom}${f.yearTo ? `–${f.yearTo}` : "+"}` : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {product.videoUrl && (
        <section id="video" className="mt-14 space-y-4 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Vidéo d&apos;installation</h2>
          <p className="text-zinc-400 text-sm">Tournée dans notre atelier : tu vois exactement ce que tu achètes, et comment il se pose.</p>
          <VideoPlayer url={product.videoUrl} />
        </section>
      )}

      {product.descriptionText.length > 0 && (
        <section className="mt-14 bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-black text-white tracking-tight mb-4">Description</h2>
          <div className="space-y-2 text-zinc-300 leading-relaxed max-w-3xl">
            {product.descriptionText.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        </section>
      )}

      {/* Barre d'achat fixe sur mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-black/95 backdrop-blur border-t border-zinc-800 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-xl leading-none">{euros(total)}</p>
          <p className="text-zinc-500 text-xs truncate mt-1">{variant?.label}{install ? " · pose incluse" : ""}</p>
        </div>
        {renderAddButton(true)}
      </div>
    </>
  );
}
