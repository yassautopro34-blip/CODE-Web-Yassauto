import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panier - Boutique YASSAUTO",
  robots: { index: false, follow: false },
};

export default function PanierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
