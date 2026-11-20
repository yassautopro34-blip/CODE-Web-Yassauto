"use client";

import { useEffect } from "react";
import { useCart } from "@/components/shop/cart-context";

export function ClearCartAfterPayment() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    try {
      window.localStorage.removeItem("yassauto_cart_v1");
    } catch {
      // Le panier est tout de même vidé en mémoire si le stockage local est bloqué.
    }
  }, [clear]);

  return null;
}
