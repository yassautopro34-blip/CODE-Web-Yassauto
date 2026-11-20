import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  path: "/faq",
  title: "FAQ garage auto – YASSAUTO Gigean",
  description:
    "Prix, délais, paiement en 3x ou 4x, garantie : les réponses aux questions qu'on nous pose au téléphone. Garage à Gigean.",
  socialTitle: "Vos questions sur la mécanique et la reprogrammation | FAQ YASSAUTO",
});

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
