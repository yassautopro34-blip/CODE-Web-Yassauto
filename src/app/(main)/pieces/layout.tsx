import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  path: "/pieces",
  title: "Pièces auto neuves et occasion – Gigean, Hérault",
  description:
    "Pièces auto neuves ou d'occasion sous 48h, retrait à Gigean ou montage au garage. Appelez le 06 48 38 05 68 pour un prix.",
  socialTitle: "Pièces de rechange auto : demandez votre devis | YASSAUTO",
});

export default function PiecesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
