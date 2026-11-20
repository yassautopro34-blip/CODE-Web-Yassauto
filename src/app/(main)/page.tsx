import { HomePage } from "@/components/home/HomePage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  path: "/",
  title: "Garage auto à Gigean – Mécanique toutes marques – YASSAUTO",
  description:
    "Garage mécanique à Gigean, sortie A9, entre Sète et Montpellier. Vidange dès 80 € TTC, distribution dès 450 €. Ouvert jusqu'à 21h. 06 48 38 05 68",
  socialTitle: "YASSAUTO | Garage automobile à Gigean",
});

export default function Home() {
  return <HomePage />;
}
