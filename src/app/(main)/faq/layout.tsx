import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ garage auto - YASSAUTO Gigean",
  description:
    "Réponses aux questions fréquentes sur la mécanique, le diagnostic, les pièces auto et l'accompagnement achat chez YASSAUTO.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
