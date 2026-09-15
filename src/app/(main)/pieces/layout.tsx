import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pièces auto neuves et occasion à Gigean",
  description:
    "Commandez vos pièces auto neuves ou d'occasion à Gigean. Recherche de référence, devis sous 24h et livraison rapide.",
};

export default function PiecesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
