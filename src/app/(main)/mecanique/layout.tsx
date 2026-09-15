import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garage mécanique Gigean - Vidange, freins, diagnostic",
  description:
    "Mécanique générale à Gigean près de Montpellier : vidange, freinage, distribution, embrayage et diagnostic. Appelez YASSAUTO au 06 48 38 05 68.",
};

export default function MecaniqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
