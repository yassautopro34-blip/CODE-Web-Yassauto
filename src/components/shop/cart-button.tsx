"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";

/** Lien panier intégré dans l'en-tête des pages boutique (pas de bouton flottant qui masque le contenu). */
export function CartButton({ className = "" }: { className?: string }) {
  const { count } = useCart();
  return (
    <Link
      href="/boutique/panier"
      aria-label={`Panier (${count} article${count > 1 ? "s" : ""})`}
      className={`shrink-0 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-brand-red/60 text-white font-bold pl-3 pr-4 py-2 rounded-full transition ${className}`}
    >
      <span className="relative">
        <ShoppingBag size={18} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-brand-red text-white text-[10px] font-black rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </span>
      <span className="text-sm">Panier</span>
    </Link>
  );
}
