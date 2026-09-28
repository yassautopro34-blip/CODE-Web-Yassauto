"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartLine {
  productId: string;
  slug: string;
  title: string;
  image?: string;
  sku: string;
  variantLabel: string;
  unitPriceTtcCents: number; // indicatif : le serveur recalcule tout au paiement
  quantity: number;
  install?: { priceTtcCents: number };
}

interface CartState {
  lines: CartLine[];
  count: number;
  totalCents: number;
  add: (line: CartLine) => void;
  setQuantity: (sku: string, productId: string, qty: number) => void;
  remove: (sku: string, productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | null>(null);
const KEY = "yassauto_cart_v1";
const same = (l: CartLine, sku: string, productId: string) => l.sku === sku && l.productId === productId;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw && active) setLines(JSON.parse(raw));
      } catch {
        /* stockage indisponible : panier en mémoire */
      }
      if (active) setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, loaded]);

  const value = useMemo<CartState>(() => {
    const lineTotal = (l: CartLine) => (l.unitPriceTtcCents + (l.install?.priceTtcCents ?? 0)) * l.quantity;
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      totalCents: lines.reduce((n, l) => n + lineTotal(l), 0),
      add: (line) =>
        setLines((prev) => {
          const existing = prev.find((l) => same(l, line.sku, line.productId));
          if (!existing) return [...prev, line];
          return prev.map((l) =>
            same(l, line.sku, line.productId)
              ? { ...l, quantity: Math.min(10, l.quantity + line.quantity), install: line.install ?? l.install }
              : l,
          );
        }),
      setQuantity: (sku, productId, qty) =>
        setLines((prev) =>
          prev.map((l) => (same(l, sku, productId) ? { ...l, quantity: Math.max(1, Math.min(10, qty)) } : l)),
        ),
      remove: (sku, productId) => setLines((prev) => prev.filter((l) => !same(l, sku, productId))),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}
