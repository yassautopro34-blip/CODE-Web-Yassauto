"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Lock, MapPin, Minus, Plus, ShoppingBag, Trash2, Truck, Wrench } from "lucide-react";
import { useCart } from "@/components/shop/cart-context";
import { ShopBackdrop } from "@/components/shop/shop-bits";

const euros = (cents: number) => (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

type Mode = "home" | "workshop_pickup";

export default function PanierPage() {
  const { lines, count, totalCents, setQuantity, remove } = useCart();
  const [chosen, setChosen] = useState<Mode>("home");
  const hasInstall = lines.some((l) => l.install);
  const mode: Mode = hasInstall ? "workshop_pickup" : chosen;

  if (lines.length === 0) {
    return (
      <div className="bg-brand-black min-h-screen relative overflow-hidden">
        <ShopBackdrop />
        <div className="relative max-w-md mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center"><ShoppingBag className="text-brand-red" /></div>
          <h1 className="text-3xl font-black text-white mb-3">Ton panier est vide</h1>
          <p className="text-zinc-400 mb-8">Écrans CarPlay, LED, ciels étoilés : jette un œil à la boutique.</p>
          <Link href="/boutique" className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white font-bold px-6 py-3.5 rounded-xl transition">Voir la boutique</Link>
        </div>
      </div>
    );
  }

  const option = (value: Mode, icon: React.ReactNode, title: string, text: string, price: string) => {
    const active = mode === value;
    const disabled = hasInstall && value === "home";
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setChosen(value)}
        className={`w-full text-left flex items-start gap-3 rounded-xl p-3.5 border transition ${active ? "border-brand-red bg-brand-red/10" : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <span className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${active ? "bg-brand-red text-white" : "bg-zinc-800 text-zinc-400"}`}>{icon}</span>
        <span className="flex-1 text-sm">
          <span className="flex justify-between gap-2"><span className="text-white font-bold">{title}</span><span className="text-white font-bold">{price}</span></span>
          <span className="block text-zinc-500 mt-0.5">{text}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="bg-brand-black min-h-screen relative overflow-hidden">
      <ShopBackdrop />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Link href="/boutique" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-6 transition"><ArrowLeft size={16} /> Continuer mes achats</Link>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8">Mon panier <span className="text-zinc-600">({count})</span></h1>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-7 space-y-3">
            {lines.map((l) => (
              <div key={l.productId + l.sku} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 md:p-4 flex gap-4">
                <Link href={`/boutique/${l.slug}`} className="w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-xl overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {l.image && <img src={l.image} alt="" className="w-full h-full object-contain p-1" />}
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between gap-3">
                    <Link href={`/boutique/${l.slug}`} className="text-white font-bold text-sm md:text-base leading-snug line-clamp-2 hover:underline">{l.title}</Link>
                    <p className="text-white font-black whitespace-nowrap">{euros((l.unitPriceTtcCents + (l.install?.priceTtcCents ?? 0)) * l.quantity)}</p>
                  </div>
                  <p className="text-zinc-500 text-xs md:text-sm mt-1">{l.variantLabel}</p>
                  {l.install && (
                    <p className="inline-flex items-center gap-1.5 text-xs text-brand-red font-semibold mt-1"><Wrench size={13} /> Pose atelier +{euros(l.install.priceTtcCents)}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg">
                      <button className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white" onClick={() => setQuantity(l.sku, l.productId, l.quantity - 1)} aria-label="Moins"><Minus size={14} /></button>
                      <span className="w-7 text-center text-white text-sm font-bold">{l.quantity}</span>
                      <button className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white" onClick={() => setQuantity(l.sku, l.productId, l.quantity + 1)} aria-label="Plus"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => remove(l.sku, l.productId)} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-brand-red transition"><Trash2 size={15} /> Retirer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 md:p-6 space-y-5">
            <div className="space-y-2">
              <p className="text-white font-black text-lg">Livraison</p>
              {option("home", <Truck size={18} />, "À domicile", "Frais inclus · 7 à 15 jours, suivi par email", "Offerte")}
              {option("workshop_pickup", <MapPin size={18} />, "Retrait à l'atelier de Gigean", "On te prévient dès que le colis arrive", "Gratuit")}
              {hasInstall && <p className="text-xs text-zinc-500 pl-1">Tu as choisi une pose : le retrait se fait à l&apos;atelier.</p>}
            </div>

            <div className="space-y-2 text-sm border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-zinc-400"><span>Sous-total</span><span>{euros(totalCents)}</span></div>
              <div className="flex justify-between text-zinc-400"><span>Livraison</span><span className="text-emerald-400 font-semibold">Incluse</span></div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-white font-bold">Total TTC</span>
                <span className="text-white text-3xl font-black tracking-tight">{euros(totalCents)}</span>
              </div>
            </div>

            <button disabled className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-500 font-black py-4 rounded-xl cursor-not-allowed">
              <Lock size={18} /> Paiement bientôt disponible
            </button>
            <ul className="space-y-1.5 text-xs text-zinc-500">
              <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Paiement sécurisé par carte (Stripe)</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Retour possible sous 14 jours</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Une question ? 06 48 38 05 68</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
