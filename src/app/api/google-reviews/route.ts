import { NextResponse } from "next/server";

// Cache les avis pendant 1 heure pour éviter trop d'appels API
let cachedReviews: GoogleReview[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface PlaceDetailsResponse {
  result: {
    reviews: GoogleReview[];
    rating: number;
    user_ratings_total: number;
    name: string;
  };
  status: string;
}

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      // En dev sans clé API, retourner des avis de démo
      return NextResponse.json({
        reviews: getDemoReviews(),
        rating: 5.0,
        totalReviews: 47,
        isDemo: true,
      });
    }

    // Vérifier le cache
    const now = Date.now();
    if (cachedReviews && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json({
        reviews: cachedReviews,
        rating: 5.0,
        totalReviews: 47,
        fromCache: true,
      });
    }

    // Appel API Google Places
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&reviews_sort=newest&language=fr&key=${apiKey}`;

    const response = await fetch(url);
    const data: PlaceDetailsResponse = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places API error:", data.status);
      return NextResponse.json({
        reviews: getDemoReviews(),
        rating: 5.0,
        totalReviews: 47,
        isDemo: true,
      });
    }

    // Filtrer uniquement les avis 4+ étoiles
    const goodReviews = data.result.reviews
      .filter((r) => r.rating >= 4)
      .slice(0, 10);

    // Mettre en cache
    cachedReviews = goodReviews;
    cacheTimestamp = now;

    return NextResponse.json({
      reviews: goodReviews,
      rating: data.result.rating,
      totalReviews: data.result.user_ratings_total,
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json({
      reviews: getDemoReviews(),
      rating: 5.0,
      totalReviews: 47,
      isDemo: true,
    });
  }
}

function getDemoReviews(): GoogleReview[] {
  return [
    {
      author_name: "Thomas M.",
      author_url: "",
      profile_photo_url: "",
      rating: 5,
      relative_time_description: "il y a 2 semaines",
      text: "Super service ! Yassine m'a accompagné pour l'achat de ma 308 et a détecté plusieurs problèmes que le vendeur avait cachés. Je recommande à 100% !",
      time: Date.now(),
    },
    {
      author_name: "Sarah L.",
      author_url: "",
      profile_photo_url: "",
      rating: 5,
      relative_time_description: "il y a 1 mois",
      text: "Travail sérieux et professionnel. Le diagnostic était complet et le prix très correct. Merci Yassine !",
      time: Date.now(),
    },
    {
      author_name: "Marc D.",
      author_url: "",
      profile_photo_url: "",
      rating: 5,
      relative_time_description: "il y a 3 semaines",
      text: "J'ai fait appel à Yassauto pour vérifier une Golf avant achat. Il a trouvé un problème de turbo que j'aurais jamais vu. Ça m'a évité une grosse arnaque !",
      time: Date.now(),
    },
    {
      author_name: "Julie R.",
      author_url: "",
      profile_photo_url: "",
      rating: 5,
      relative_time_description: "il y a 1 mois",
      text: "Étudiant et je connais rien en mécanique... Yassine a pris le temps de tout m'expliquer. Prix réduit pour les étudiants, c'est top !",
      time: Date.now(),
    },
    {
      author_name: "Karim B.",
      author_url: "",
      profile_photo_url: "",
      rating: 5,
      relative_time_description: "il y a 2 mois",
      text: "Meilleur rapport qualité/prix de Montpellier. Réactif, honnête et compétent. Ma voiture tourne comme une horloge maintenant !",
      time: Date.now(),
    },
  ];
}
