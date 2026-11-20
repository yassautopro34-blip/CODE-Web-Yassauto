import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  path: "/propos",
  title: "À propos de YASSAUTO, garage mécanique à Gigean",
  description:
    "Découvrez YASSAUTO MKLF, son expérience en mécanique et son accompagnement automobile à Gigean près de Montpellier.",
  socialTitle: "Qui est derrière YASSAUTO ? Yassine, mécanicien à Gigean",
});

export default function ProposLayout({ children }: { children: React.ReactNode }) {
  return children;
}
