import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact et horaires - Garage YASSAUTO Gigean 34770",
  description:
    "YASSAUTO MKLF, 7 rue André Marie Ampère, 34770 Gigean. Ouvert du lundi au vendredi de 10h à 22h. Téléphone : 06 48 38 05 68.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
