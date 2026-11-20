import { SITE_URL } from "@/lib/site-info";

export type ServiceSlug = "vidange" | "distribution" | "embrayage" | "freins" | "fap-egr-adblue" | "diagnostic";

export type ServiceFaq = { q: string; a: string };

export type Service = {
  slug: ServiceSlug;
  /** Libellé court (menu, cartes, fil d'Ariane). */
  name: string;
  /** Prix numérique pour le JSON-LD, null si non affichable. */
  priceValue: number | null;
  /** Texte de prix affiché (« dès 80 € TTC »). */
  priceLabel: string;
  /** Prestation décrite dans l'offre JSON-LD. */
  offerName: string;
  title: string;
  description: string;
  h1: string;
  /** Bloc réponse : visible sans défiler. */
  answer: string;
  duration: string;
  included: string[];
  /** Lignes du tableau « prix selon le véhicule ». */
  priceTable: { label: string; price: string }[];
  guarantee?: string;
  when: { title: string; text: string };
  why: string[];
  faq: ServiceFaq[];
  /** Prestations voisines pour le maillage interne. */
  related: ServiceSlug[];
};

export const SERVICES: Service[] = [
  {
    slug: "vidange",
    name: "Vidange",
    priceValue: 80,
    priceLabel: "dès 80 € TTC",
    offerName: "Vidange avec filtre à huile",
    title: "Vidange à Gigean dès 80 € TTC – YASSAUTO",
    description:
      "Vidange avec filtre à huile dès 80 € TTC, formule 4 filtres dès 140 €. Sur rendez-vous à Gigean, jusqu'à 21h. Appelez le 06 48 38 05 68.",
    h1: "Vidange à Gigean, dès 80 € TTC",
    answer:
      "Vidange avec filtre à huile à partir de 80 € TTC, pièces et main-d'œuvre. Vidange complète avec 4 filtres à partir de 140 € TTC. Comptez environ 45 minutes, sur rendez-vous du lundi au vendredi jusqu'à 21h.",
    duration: "environ 45 minutes",
    included: [
      "Huile moteur aux normes de votre constructeur",
      "Filtre à huile neuf",
      "Contrôle des niveaux (liquide de frein, refroidissement, lave-glace)",
      "Contrôle visuel des pneus et des plaquettes",
      "Remise à zéro du voyant d'entretien",
      "Formule 4 filtres : filtre à air, filtre à carburant et filtre d'habitacle en plus",
    ],
    priceTable: [
      { label: "Vidange + filtre à huile", price: "dès 80 € TTC" },
      { label: "Vidange complète 4 filtres", price: "dès 140 € TTC" },
    ],
    guarantee:
      "Votre carnet d'entretien reste valable. On utilise une huile et des filtres conformes aux préconisations du constructeur et on tamponne le carnet. La garantie constructeur est conservée.",
    when: {
      title: "Quand faire la vidange ?",
      text: "En général tous les 15 000 à 30 000 km ou une fois par an, selon votre moteur. Le voyant d'entretien ou votre carnet donnent le bon rythme. Une huile noire et épaisse à la jauge est un signe qu'il ne faut pas attendre.",
    },
    why: [
      "Prix annoncé avant les travaux",
      "Ouvert jusqu'à 21h en semaine",
      "Paiement en 3x ou 4x avec Oney selon éligibilité",
    ],
    faq: [
      { q: "Combien de temps ça prend ?", a: "Environ 45 minutes pour une vidange avec filtre à huile. Un peu plus avec la formule 4 filtres." },
      { q: "Je peux attendre sur place ?", a: "Oui si le créneau le permet. Dites-le au téléphone au moment de réserver." },
      { q: "Vous fournissez l'huile ?", a: "Oui, une huile conforme aux préconisations de votre constructeur est comprise dans le prix, selon le véhicule." },
      { q: "Je peux payer en plusieurs fois ?", a: "Oui, en 3x ou 4x avec Oney selon éligibilité, ainsi que par carte ou en espèces." },
    ],
    related: ["freins", "diagnostic"],
  },
  {
    slug: "distribution",
    name: "Distribution",
    priceValue: 450,
    priceLabel: "dès 450 € TTC",
    offerName: "Kit de distribution",
    title: "Distribution à Gigean dès 450 € TTC – YASSAUTO",
    description:
      "Kit de distribution dès 450 € TTC pour 1.5 dCi, ou 600 € TTC avec pièces d'origine. Garage à Gigean, prix annoncé avant travaux. 06 48 38 05 68.",
    h1: "Courroie de distribution à Gigean, dès 450 € TTC",
    answer:
      "Remplacement du kit de distribution à partir de 450 € TTC pour un 1.5 dCi, pièces et main-d'œuvre. Version avec pièces d'origine : 600 € TTC. Le prix exact dépend de votre moteur et est annoncé au téléphone avant les travaux.",
    duration: "à confirmer au téléphone selon le moteur",
    included: [
      "Courroie (ou chaîne selon moteur), galets et tendeur neufs",
      "Pompe à eau incluse selon le kit retenu (version pièces d'origine : 600 € TTC)",
      "Contrôle des courroies d'accessoires et des fuites autour du moteur",
      "Essai et remise à zéro des rappels d'entretien",
    ],
    priceTable: [
      { label: "Kit de distribution 1.5 dCi", price: "dès 450 € TTC" },
      { label: "Kit distribution 1.5 dCi avec pièces d'origine", price: "600 € TTC" },
    ],
    when: {
      title: "Quand changer la distribution ?",
      text: "Selon le constructeur, tous les 120 000 à 240 000 km ou tous les 5 à 10 ans. Votre carnet donne l'échéance exacte. Une courroie qui casse peut détruire le moteur : un remplacement préventif coûte nettement moins cher qu'une réparation après casse.",
    },
    why: [
      "Prix annoncé avant les travaux",
      "Ouvert jusqu'à 21h en semaine",
      "Paiement en 3x ou 4x avec Oney selon éligibilité",
    ],
    faq: [
      { q: "Pourquoi changer aussi la pompe à eau ?", a: "Elle est souvent entraînée par la courroie : la remplacer en même temps évite de démonter deux fois le moteur." },
      { q: "Le prix dépend de quoi ?", a: "Du moteur, du kit et de l'accès aux pièces. Le tarif à partir de 450 € concerne un 1.5 dCi, avec une version à 600 € TTC en pièces d'origine. Les autres moteurs sont chiffrés au téléphone." },
      { q: "Comment savoir si ma voiture a une courroie ou une chaîne ?", a: "Donnez-nous l'immatriculation, on vous le confirme au téléphone." },
      { q: "Je peux payer en plusieurs fois ?", a: "Oui, en 3x ou 4x avec Oney selon éligibilité." },
    ],
    related: ["vidange", "embrayage"],
  },
  {
    slug: "embrayage",
    name: "Embrayage",
    priceValue: 450,
    priceLabel: "dès 450 € TTC",
    offerName: "Changement d'embrayage",
    title: "Changement d'embrayage à Gigean dès 450 € – YASSAUTO",
    description:
      "Changement d'embrayage dès 450 € TTC, pièces et main-d'œuvre. Patine, pédale dure, bruit : diagnostic à Gigean. Appelez le 06 48 38 05 68.",
    h1: "Changement d'embrayage à Gigean, dès 450 € TTC",
    answer:
      "Remplacement du kit d'embrayage à partir de 450 € TTC, pièces et main-d'œuvre. Le prix exact dépend du véhicule (volant moteur bimasse, boîte), annoncé au téléphone avant les travaux.",
    duration: "à confirmer au téléphone selon le véhicule",
    included: [
      "Kit d'embrayage neuf (disque, mécanisme, butée)",
      "Contrôle du volant moteur et remplacement si nécessaire (sur devis)",
      "Contrôle des fuites d'huile côté boîte",
      "Essai routier après intervention",
    ],
    priceTable: [{ label: "Kit d'embrayage", price: "dès 450 € TTC" }],
    when: {
      title: "Quels symptômes ?",
      text: "L'embrayage patine (le moteur monte dans les tours sans accélérer), la pédale devient dure ou molle, un bruit apparaît quand on appuie, ou les vitesses craquent. Dès les premiers signes, mieux vaut venir faire contrôler.",
    },
    why: [
      "Prix annoncé avant les travaux",
      "Ouvert jusqu'à 21h en semaine",
      "Paiement en 3x ou 4x avec Oney selon éligibilité",
    ],
    faq: [
      { q: "Comment savoir si mon embrayage est usé ?", a: "Patinage en accélération, pédale dure, point de patinage très haut ou bruit à l'appui. Un contrôle rapide permet de confirmer." },
      { q: "Faut-il changer le volant moteur ?", a: "Pas toujours. On le contrôle à la dépose et on vous prévient avant de le remplacer." },
      { q: "Combien de temps la voiture reste au garage ?", a: "On vous donne le délai au téléphone selon le véhicule et la disponibilité des pièces." },
      { q: "Je peux payer en plusieurs fois ?", a: "Oui, en 3x ou 4x avec Oney selon éligibilité." },
    ],
    related: ["distribution", "diagnostic"],
  },
  {
    slug: "freins",
    name: "Freins",
    priceValue: 60,
    priceLabel: "dès 60 € TTC",
    offerName: "Plaquettes de frein avant",
    title: "Plaquettes de frein à Gigean dès 60 € – YASSAUTO",
    description:
      "Changement de plaquettes de frein avant dès 60 € TTC. Frein qui grince, disques usés : contrôle à Gigean, prix annoncé avant travaux. 06 48 38 05 68.",
    h1: "Plaquettes et disques de frein à Gigean, dès 60 € TTC",
    answer:
      "Changement des plaquettes avant à partir de 60 € TTC, pièces et main-d'œuvre. Le remplacement des disques se chiffre au téléphone selon le véhicule. Le freinage est un point de sécurité : on vous annonce le prix avant les travaux.",
    duration: "à confirmer au téléphone selon le véhicule",
    included: [
      "Plaquettes de frein neuves",
      "Contrôle de l'état des disques et des étriers",
      "Contrôle du liquide de frein",
      "Essai routier après intervention",
    ],
    priceTable: [
      { label: "Plaquettes avant", price: "dès 60 € TTC" },
      { label: "Disques + plaquettes", price: "sur devis" },
    ],
    when: {
      title: "Frein qui grince : que faire ?",
      text: "Un grincement, une vibration dans la pédale ou une distance de freinage plus longue sont des signes d'usure. Un témoin d'usure de plaquettes allumé demande aussi un contrôle sans attendre.",
    },
    why: [
      "Prix annoncé avant les travaux",
      "Ouvert jusqu'à 21h en semaine",
      "Paiement en 3x ou 4x avec Oney selon éligibilité",
    ],
    faq: [
      { q: "Quand changer les plaquettes ?", a: "Selon l'usage, souvent entre 20 000 et 60 000 km. Un contrôle visuel rapide permet de savoir où on en est." },
      { q: "Faut-il changer les disques en même temps ?", a: "Si les disques sont voilés, rayés ou sous l'épaisseur minimale, oui. Sinon on peut ne changer que les plaquettes." },
      { q: "Pourquoi mon frein grince ?", a: "Plaquettes usées, disques marqués ou encrassement : un contrôle permet de trancher." },
      { q: "Je peux payer en plusieurs fois ?", a: "Oui, en 3x ou 4x avec Oney selon éligibilité." },
    ],
    related: ["vidange", "diagnostic"],
  },
  {
    slug: "fap-egr-adblue",
    name: "FAP, EGR, AdBlue",
    priceValue: 50,
    priceLabel: "diagnostic 50 € TTC",
    offerName: "Diagnostic FAP, EGR, AdBlue",
    title: "Nettoyage FAP, EGR, AdBlue à Gigean – Diagnostic 50 €",
    description:
      "Perte de puissance, mode dégradé, voyant antipollution ? Diagnostic 50 €, nettoyage et réparation FAP, EGR, AdBlue à Gigean. 06 48 38 05 68.",
    h1: "Nettoyage FAP, vanne EGR, AdBlue à Gigean : diagnostic 50 €",
    answer:
      "On commence par un diagnostic à 50 €, puis on nettoie ou on répare le FAP, la vanne EGR ou le circuit AdBlue. On ne supprime aucun système antipollution : votre voiture reste conforme et passe le contrôle technique.",
    duration: "à confirmer au téléphone selon le véhicule",
    included: [
      "Lecture des défauts à la valise multimarque",
      "Contrôle des capteurs (pression différentielle, sondes, NOx)",
      "Nettoyage du FAP ou de la vanne EGR quand c'est possible",
      "Réparation ou remplacement ciblé (capteur, vanne, pompe AdBlue, injecteur) sur devis",
    ],
    priceTable: [
      { label: "Diagnostic (déduit si réparation chez nous)", price: "50 € TTC" },
      { label: "Nettoyage / réparation", price: "sur devis après diagnostic" },
    ],
    when: {
      title: "Quels symptômes ?",
      text: "Perte de puissance, mode dégradé, voyant antipollution ou moteur allumé, fumée noire, consommation en hausse, message AdBlue au tableau de bord. Plus on intervient tôt, plus la réparation reste simple.",
    },
    why: [
      "Diagnostic annoncé : 50 €, déduit si les réparations sont faites chez nous",
      "Aucun système antipollution supprimé",
      "Paiement en 3x ou 4x avec Oney selon éligibilité",
    ],
    faq: [
      { q: "Vous supprimez le FAP ?", a: "Non. Nous nettoyons ou réparons, sans jamais supprimer ni désactiver un système antipollution." },
      { q: "Ma voiture passera-t-elle le contrôle technique ?", a: "Oui : la voiture reste conforme à son homologation d'origine." },
      { q: "Le diagnostic est-il remboursé ?", a: "Le montant est déduit si les réparations sont faites chez nous." },
      { q: "Combien coûte la réparation ?", a: "Elle dépend de la panne trouvée. Le devis vous est donné après diagnostic, avant toute intervention." },
    ],
    related: ["diagnostic", "vidange"],
  },
  {
    slug: "diagnostic",
    name: "Diagnostic",
    priceValue: 50,
    priceLabel: "50 € TTC",
    offerName: "Diagnostic automobile",
    title: "Diagnostic auto à Gigean : 50 €, déduit si réparation",
    description:
      "Voyant moteur allumé, mode dégradé, bruit suspect : diagnostic à la valise multimarque 50 €, déduit si réparation chez nous. Gigean. 06 48 38 05 68.",
    h1: "Diagnostic voiture à Gigean : 50 €, déduit si réparation",
    answer:
      "Diagnostic à la valise multimarque : 50 € TTC (30 € pour les étudiants sur présentation de la carte). Le montant est déduit si les réparations sont faites chez nous.",
    duration: "à confirmer au téléphone selon le véhicule",
    included: [
      "Lecture et analyse des défauts enregistrés",
      "Contrôle des capteurs et des mesures en direct",
      "Explication claire de la panne et de ce qu'il faut faire",
      "Devis annoncé avant toute réparation",
    ],
    priceTable: [
      { label: "Diagnostic", price: "50 € TTC" },
      { label: "Diagnostic étudiant (carte valide)", price: "30 € TTC" },
    ],
    when: {
      title: "Quand faire un diagnostic ?",
      text: "Voyant moteur ou antipollution allumé, mode dégradé, perte de puissance, démarrage difficile ou bruit inhabituel. Mieux vaut diagnostiquer tôt que de remplacer des pièces au hasard.",
    },
    why: [
      "Diagnostic déduit si la réparation est faite chez nous",
      "Ouvert jusqu'à 21h en semaine",
      "Valise multimarque",
    ],
    faq: [
      { q: "Que comprend le diagnostic ?", a: "La lecture des défauts, le contrôle des capteurs et une explication claire de la panne, avec un devis avant toute réparation." },
      { q: "Le prix est-il remboursé ?", a: "Il est déduit si vous faites faire la réparation chez nous." },
      { q: "Vous diagnostiquez toutes les marques ?", a: "Oui, la valise est multimarque." },
      { q: "Faut-il prendre rendez-vous ?", a: "Oui, on travaille sur rendez-vous. Appelez, on vous propose un créneau sous 48h." },
    ],
    related: ["fap-egr-adblue", "freins"],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const serviceUrl = (slug: ServiceSlug) => `${SITE_URL}/${slug}`;
