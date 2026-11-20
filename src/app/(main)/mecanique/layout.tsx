import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  path: "/mecanique",
  title: "Garage mécanique Gigean – Entretien et réparation auto",
  description:
    "Vidange, freins, distribution, embrayage, diagnostic à Gigean. Prix annoncé avant travaux, paiement 3x ou 4x. Appelez le 06 48 38 05 68",
  socialTitle: "Entretien et réparation auto à Gigean | Devis gratuit YASSAUTO",
});

export default function MecaniqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
