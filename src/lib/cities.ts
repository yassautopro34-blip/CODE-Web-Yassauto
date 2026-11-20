import { SITE_URL } from "@/lib/site-info";

export type CitySlug =
  | "garage-sete"
  | "garage-fabregues-cournonterral"
  | "garage-frontignan"
  | "garage-montpellier-ouest"
  | "garage-poussan-balaruc"
  | "garage-meze";

export type City = {
  slug: CitySlug;
  name: string;
  title: string;
  description: string;
  h1: string;
  angle: string;
  served: string[];
  neighbors: CitySlug[];
};

export const CITIES: City[] = [
  {
    slug: "garage-sete",
    name: "Sète",
    title: "Garage à Sète : YASSAUTO à Gigean, prix affichés",
    description:
      "Habitant de Sète ? Garage à Gigean, prix annoncé avant travaux, ouvert jusqu'à 21h, paiement 3x ou 4x. Vidange dès 80 €. Appelez le 06 48 38 05 68.",
    h1: "Garage auto pour les habitants de Sète",
    angle: "Évitez les bouchons et les prix du centre de Sète : le garage est à Gigean, avec des prix affichés.",
    served: ["Sète", "Le Lido", "La Peyrade", "Frontignan"],
    neighbors: ["garage-frontignan", "garage-poussan-balaruc"],
  },
  {
    slug: "garage-fabregues-cournonterral",
    name: "Fabrègues et Cournonterral",
    title: "Garage à Fabrègues et Cournonterral : YASSAUTO Gigean",
    description:
      "Garage pour Fabrègues et Cournonterral : prix annoncé avant travaux, ouvert jusqu'à 21h, paiement 3x ou 4x. Appelez le 06 48 38 05 68.",
    h1: "Garage auto pour les habitants de Fabrègues et Cournonterral",
    angle: "Un garage indépendant à Gigean, avec le prix annoncé avant les travaux.",
    served: ["Fabrègues", "Cournonterral", "Saint-Jean-de-Védas"],
    neighbors: ["garage-montpellier-ouest", "garage-poussan-balaruc"],
  },
  {
    slug: "garage-frontignan",
    name: "Frontignan",
    title: "Garage à Frontignan : YASSAUTO à Gigean, prix affichés",
    description:
      "Habitant de Frontignan ? Garage à Gigean : vidange dès 80 €, freins dès 60 €, prix annoncé avant travaux, ouvert jusqu'à 21h. 06 48 38 05 68.",
    h1: "Garage auto pour les habitants de Frontignan",
    angle: "Clients du Lido et de La Peyrade : un garage à Gigean, prix affichés avant travaux.",
    served: ["Frontignan", "Le Lido", "La Peyrade"],
    neighbors: ["garage-sete", "garage-poussan-balaruc"],
  },
  {
    slug: "garage-montpellier-ouest",
    name: "Montpellier ouest",
    title: "Garage Montpellier ouest : YASSAUTO à Gigean, jusqu'à 21h",
    description:
      "Garage pour Saint-Jean-de-Védas et Montpellier ouest : ouvert jusqu'à 21h après le travail, prix annoncé avant travaux, paiement 3x ou 4x. 06 48 38 05 68.",
    h1: "Garage auto pour Saint-Jean-de-Védas et Montpellier ouest",
    angle: "Ouvert après le travail, jusqu'à 21h, avec des prix affichés.",
    served: ["Saint-Jean-de-Védas", "Montpellier ouest", "Lavérune"],
    neighbors: ["garage-fabregues-cournonterral", "garage-sete"],
  },
  {
    slug: "garage-poussan-balaruc",
    name: "Poussan et Balaruc",
    title: "Garage à Poussan et Balaruc : YASSAUTO à Gigean",
    description:
      "Garage pour Poussan et Balaruc-les-Bains, à quelques minutes de Gigean. Prix annoncé avant travaux, ouvert jusqu'à 21h. 06 48 38 05 68.",
    h1: "Garage auto pour les habitants de Poussan et Balaruc",
    angle: "Le garage le plus proche, à quelques minutes de chez vous.",
    served: ["Poussan", "Balaruc-les-Bains", "Balaruc-le-Vieux"],
    neighbors: ["garage-meze", "garage-sete"],
  },
  {
    slug: "garage-meze",
    name: "Mèze",
    title: "Garage à Mèze et bassin de Thau : YASSAUTO à Gigean",
    description:
      "Garage pour Mèze et le bassin de Thau : prix annoncé avant travaux, ouvert jusqu'à 21h, paiement 3x ou 4x. Appelez le 06 48 38 05 68.",
    h1: "Garage auto pour les habitants de Mèze et du bassin de Thau",
    angle: "Côté ouest de l'étang de Thau, un garage à Gigean avec des prix affichés.",
    served: ["Mèze", "Loupian", "Bouzigues"],
    neighbors: ["garage-poussan-balaruc", "garage-sete"],
  },
];

export const PUBLISHED_CITIES = CITIES;

export const getCity = (slug: string) => CITIES.find((c) => c.slug === slug);

export const cityUrl = (slug: CitySlug) => `${SITE_URL}/${slug}`;
