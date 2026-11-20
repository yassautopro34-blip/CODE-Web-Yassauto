import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  path: "/contact",
  title: "Contact et horaires – Garage YASSAUTO Gigean 34770",
  description:
    "YASSAUTO, 7 rue André Marie Ampère, 34770 Gigean. Lundi-vendredi 10h-21h, sur rendez-vous. 06 48 38 05 68",
  socialTitle: "Contacter YASSAUTO, garage à Gigean | Adresse, téléphone, horaires",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
