import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  path: "/reprogrammation",
  title: "FAP, EGR, AdBlue et reprogrammation – Garage Gigean",
  description:
    "Perte de puissance, mode dégradé, voyant antipollution ? Diagnostic 50 €, nettoyage FAP et EGR, Stage 1. Gigean, sortie A9. 06 48 38 05 68",
  socialTitle: "Perte de puissance, FAP, EGR : diagnostic à Gigean | YASSAUTO",
});

export default function ReprogrammationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
