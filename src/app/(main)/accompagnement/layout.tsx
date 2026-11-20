import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  path: "/accompagnement",
  title: "Accompagnement achat voiture d'occasion – Montpellier",
  description:
    "On inspecte la voiture avec vous avant l'achat : mécanique, électronique, papiers. 150 €, étudiant 100 €. Montpellier et alentours.",
  socialTitle: "Acheter une voiture d'occasion sans se faire arnaquer | YASSAUTO",
});

export default function AccompagnementLayout({ children }: { children: React.ReactNode }) {
  return children;
}
