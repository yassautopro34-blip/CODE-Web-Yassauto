import type { Metadata } from "next";

type PageSeo = {
  title: string;
  description: string;
  /** Chemin canonique, ex. "/mecanique" (sans domaine). */
  path: string;
  /** Titre social (og/twitter) si différent du <title>. */
  socialTitle?: string;
  noindex?: boolean;
};

const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "YASSAUTO, garage automobile à Gigean" };

/**
 * Métadonnées d'une page : title, description, canonique propre à la page,
 * og:title / twitter:title uniques (Next remplace en bloc l'objet openGraph du parent).
 */
export function buildPageMetadata({ title, description, path, socialTitle, noindex }: PageSeo): Metadata {
  const shareTitle = socialTitle ?? title;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "YASSAUTO MKLF",
      url: path,
      title: shareTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [OG_IMAGE.url],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
