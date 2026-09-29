"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CarFront, Check, ChevronLeft, ChevronRight, CircleCheck, Expand, MapPin, PackageCheck, PlayCircle, ShieldCheck, ShoppingBag, Sparkles, Truck, Wrench, X } from "lucide-react";
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

const DESCRIPTION_HEADINGS = new Set([
  "testé dans notre atelier",
  "compatibilité",
  "fonctions",
  "fonctions d'origine conservées",
  "fonctions d’origine conservées",
  "choisissez votre version",
  "contenu du colis",
  "installation",
]);

function descriptionTheme(title: string) {
  const normalized = title.toLocaleLowerCase("fr");
  if (normalized.includes("compatibil") || normalized.includes("véhicule")) {
    return { icon: CarFront, color: "text-sky-300", border: "border-sky-400/30", wash: "bg-sky-400/10", dot: "bg-sky-300" };
  }
  if (normalized.includes("fonction")) {
    return { icon: Sparkles, color: "text-amber-300", border: "border-amber-400/30", wash: "bg-amber-400/10", dot: "bg-amber-300" };
  }
  if (normalized.includes("install") || normalized.includes("atelier") || normalized.includes("pose")) {
    return { icon: Wrench, color: "text-emerald-300", border: "border-emerald-400/30", wash: "bg-emerald-400/10", dot: "bg-emerald-300" };
  }
  if (normalized.includes("contenu") || normalized.includes("colis")) {
    return { icon: PackageCheck, color: "text-orange-300", border: "border-orange-400/30", wash: "bg-orange-400/10", dot: "bg-orange-300" };
  }
  return { icon: CircleCheck, color: "text-brand-red", border: "border-brand-red/30", wash: "bg-brand-red/10", dot: "bg-brand-red" };
}

function organizeDescription(lines: string[]) {
  const introduction: string[] = [];
  const sections: { title: string; lines: string[] }[] = [];
  let current: { title: string; lines: string[] } | undefined;

  for (const line of lines) {
    const parts = line.split(/\s+•\s+/).filter(Boolean);
    const expanded = parts.flatMap((part, index) => index === 0 ? [part.trim()] : [`• ${part.trim()}`]);
    for (const rawText of expanded) {
      const text = rawText.trim();
      const isHeading = DESCRIPTION_HEADINGS.has(text.toLocaleLowerCase("fr")) || (text.endsWith(":") && text.length < 64);
      if (isHeading) {
        current = { title: text.replace(/:$/, ""), lines: [] };
        sections.push(current);
      } else if (current) {
        current.lines.push(text);
      } else {
        introduction.push(text);
      }
    }
  }
  return { introduction, sections };
}

export function ProductView({ product }: { product: PublicProduct }) {
  const { add } = useCart();
  const firstAvailable = product.variants.find((v) => v.available) ?? product.variants[0];
  const [sku, setSku] = useState(firstAvailable?.sku ?? "");
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [install, setInstall] = useState(false);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const variant = product.variants.find((v) => v.sku === sku) ?? firstAvailable;
  const installPrice = install && product.installOffer ? product.installOffer.priceTtcCents : 0;
  const total = ((variant?.priceTtcCents ?? 0) + installPrice) * qty;
  const images = product.images;
  const image = images[imageIndex];
  const description = organizeDescription(product.descriptionText);
  const step = (d: number) => setImageIndex((i) => (i + d + images.length) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft" && images.length > 1) setImageIndex((i) => (i - 1 + images.length) % images.length);
      if (event.key === "ArrowRight" && images.length > 1) setImageIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, lightboxOpen]);

  useEffect(() => {
    const container = descriptionRef.current;
    if (!container || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = [...container.querySelectorAll<HTMLElement>(".product-description-reveal")];
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

    container.classList.add("scroll-reveal-active");
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      container.classList.remove("scroll-reveal-active");
      sections.forEach((section) => section.classList.remove("is-visible"));
    };
  }, [product.id, product.descriptionText.length]);

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
              <button type="button" onClick={() => setLightboxOpen(true)} aria-label="Agrandir la photo" className="absolute inset-0 flex h-full w-full cursor-zoom-in items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={product.title} className="h-full w-full object-contain" />
              </button>
            )}
            <button type="button" onClick={() => setLightboxOpen(true)} aria-label="Afficher en plein écran" className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-black/75 text-white opacity-100 transition hover:bg-brand-red sm:opacity-0 sm:group-hover:opacity-100"><Expand size={17} /></button>
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
        <section className="mt-14 border-t border-zinc-800 pt-8 md:pt-12">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="product-description-reveal lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-bold uppercase text-brand-red">Le produit en détail</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">Description</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">Les informations et conseils fournis pour ce modèle, réunis au même endroit.</p>
            </div>
            <div ref={descriptionRef} className="product-description-scroll space-y-8">
              {description.introduction.filter((line) => !line.startsWith("•")).map((line, index) => (
                <p key={index} className={`product-description-reveal max-w-3xl text-base leading-relaxed text-zinc-200 md:text-lg ${index === 0 ? "border-l-2 border-brand-red pl-5" : "pl-5 text-zinc-400"}`}>
                  {line}
                </p>
              ))}
              {description.introduction.some((line) => line.startsWith("•")) && (
                <ul className="product-description-reveal grid gap-2 sm:grid-cols-2">
                  {description.introduction.filter((line) => line.startsWith("•")).map((line, index) => <li key={index} className="flex gap-3 border-b border-zinc-800/70 py-2 text-sm leading-relaxed text-zinc-300"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />{line.replace(/^•\s*/, "")}</li>)}
                </ul>
              )}
              {description.sections.map((section, index) => {
                const bullets = section.lines.filter((line) => line.startsWith("•"));
                const paragraphs = section.lines.filter((line) => !line.startsWith("•"));
                const theme = descriptionTheme(section.title);
                const Icon = theme.icon;
                return (
                  <section key={`${section.title}-${index}`} className="product-description-reveal border-t border-zinc-800/80 pt-5">
                    <h3 className="flex items-center gap-3 text-lg font-black text-white md:text-xl">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${theme.border} ${theme.wash} ${theme.color}`}><Icon size={17} /></span>
                      {section.title}
                    </h3>
                    {paragraphs.length > 0 && <div className="mt-3 max-w-3xl space-y-3 border-l border-zinc-700 pl-4 text-sm leading-relaxed text-zinc-400 md:text-base">{paragraphs.map((line, lineIndex) => <p key={lineIndex}>{line}</p>)}</div>}
                    {bullets.length > 0 && <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">{bullets.map((line, lineIndex) => <li key={lineIndex} className="flex gap-3 border-b border-zinc-800/70 py-2.5 text-sm leading-relaxed text-zinc-300"><span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot}`} />{line.replace(/^•\s*/, "")}</li>)}</ul>}
                  </section>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {lightboxOpen && image && (
        <div role="dialog" aria-modal="true" aria-label="Photo du produit en plein écran" onClick={() => setLightboxOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm md:p-8">
          <button type="button" onClick={() => setLightboxOpen(false)} aria-label="Fermer la photo" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-zinc-900 text-white transition hover:border-brand-red"><X size={20} /></button>
          {images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); step(-1); }} aria-label="Photo précédente" className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-zinc-900/90 text-white transition hover:border-brand-red md:left-6 md:h-14 md:w-14"><ChevronLeft size={24} /></button>}
          <div className="flex h-full w-full flex-col items-center justify-center gap-3" onClick={(event) => event.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={product.title} className="max-h-[78dvh] max-w-full select-none object-contain md:max-h-[84dvh]" />
            <p className="max-w-[80vw] truncate text-center text-xs text-zinc-400">{product.title}{images.length > 1 ? ` · ${imageIndex + 1} / ${images.length}` : ""}</p>
          </div>
          {images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); step(1); }} aria-label="Photo suivante" className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-zinc-900/90 text-white transition hover:border-brand-red md:right-6 md:h-14 md:w-14"><ChevronRight size={24} /></button>}
        </div>
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
