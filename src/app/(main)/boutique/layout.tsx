import type { Metadata } from "next";
import { CartProvider } from "@/components/shop/cart-context";

export const metadata: Metadata = {
  title: "Boutique accessoires auto - écrans CarPlay, LED, ciel étoilé | YASSAUTO Gigean",
  description:
    "Écrans CarPlay / Android Auto, bandes LED d'ambiance et ciels étoilés pour votre voiture. Pose possible à notre atelier de Gigean, près de Montpellier.",
  // Boutique en rodage : pas d'indexation Google avant le lancement officiel
  robots: { index: false, follow: false },
};

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
