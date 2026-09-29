"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";

export function CartButton({ className = "" }: { className?: string }) {
  const { count } = useCart();
  return (
    <Link
      href="/boutique/panier"
      aria-label={`Panier (${count} article${count > 1 ? "s" : ""})`}
      className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/95 pl-3 pr-4 font-bold text-white shadow-xl shadow-black/30 backdrop-blur transition hover:border-brand-red/70 ${className}`}
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
