import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos de YASSAUTO - Garage et expertise mécanique à Gigean",
  description:
    "Découvrez YASSAUTO MKLF, son expérience en mécanique et son accompagnement automobile à Gigean près de Montpellier.",
};

export default function ProposLayout({ children }: { children: React.ReactNode }) {
  return children;
}
