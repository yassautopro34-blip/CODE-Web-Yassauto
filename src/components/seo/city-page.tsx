import Link from "next/link";
import { PUBLISHED_CITIES, getCity, type City } from "@/lib/cities";
import { SERVICES } from "@/lib/services";
import { ADDRESS_LINE, HOURS_TEXT, SITE_URL } from "@/lib/site-info";
import { Breadcrumbs, CallButton, JsonLd } from "@/components/seo/seo-bits";

export function CityPage({ city }: { city: City }) {
  const neighbors = city.neighbors
    .map((s) => getCity(s))
    .filter((c): c is City => Boolean(c) && PUBLISHED_CITIES.some((p) => p.slug === c!.slug));
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Quel est le prix d'une vidange pour un client de ${city.name} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "La vidange avec filtre à huile est proposée à partir de 80 € TTC, pièces et main-d'œuvre. Le tarif exact est confirmé selon le véhicule avant l'intervention.",
        },
      },
      {
        "@type": "Question",
        name: `Comment prendre rendez-vous depuis ${city.name} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Appelez le 06 48 38 05 68 pour réserver à l'atelier YASSAUTO, ${ADDRESS_LINE}. Le garage est ouvert ${HOURS_TEXT}.`,
        },
      },
      {
        "@type": "Question",
        name: "Le prix est-il annoncé avant les travaux ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Le montant dépend du véhicule et le devis est confirmé avant toute réparation.",
        },
      },
    ],
  };
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Garage automobile pour ${city.name}`,
    url: `${SITE_URL}/${city.slug}`,
    areaServed: city.served,
    provider: {
      "@type": "AutoRepair",
      "@id": `${SITE_URL}/#garage`,
      name: "YASSAUTO MKLF",
      telephone: "+33648380568",
    },
    offers: SERVICES.filter((service) => service.priceValue !== null).map((service) => ({
      "@type": "Offer",
      price: String(service.priceValue),
      priceCurrency: "EUR",
      url: `${SITE_URL}/${service.slug}`,
      itemOffered: { "@type": "Service", name: service.offerName },
    })),
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-800 bg-brand-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
          <Breadcrumbs dark items={[{ name: city.name, path: `/${city.slug}` }]} />
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
            {city.h1}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-300 md:text-lg">
            {city.angle} Ouvert {HOURS_TEXT}, au {ADDRESS_LINE}.
          </p>
          <div className="mt-6 max-w-md">
            <CallButton />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 text-zinc-700 sm:px-6">
        <section>
          <h2 className="text-2xl font-black text-zinc-900">Pourquoi faire le trajet</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>Prix affichés et annoncés avant les travaux</li>
            <li>Ouvert jusqu&apos;à 21h en semaine</li>
            <li>Paiement en 3x ou 4x avec Oney selon éligibilité</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-zinc-900">Nos prestations et leurs prix</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:border-brand-red">
                  <span className="font-semibold text-zinc-900">{s.name} à Gigean</span>
                  <span className="block text-sm text-zinc-500">{s.priceLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-zinc-900">Communes desservies</h2>
          <p className="mt-3">{city.served.join(", ")}.</p>
          {neighbors.length > 0 && (
            <p className="mt-2">
              Voir aussi :{" "}
              {neighbors.map((n, i) => (
                <span key={n.slug}>{i > 0 && ", "}<Link href={`/${n.slug}`} className="underline">garage {n.name}</Link></span>
              ))}
            </p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-black text-zinc-900">Questions fréquentes</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="font-semibold text-zinc-900">Puis-je venir depuis {city.name} sans rendez-vous ?</dt>
              <dd className="mt-1">Le garage travaille sur rendez-vous. Appelez pour confirmer la disponibilité du créneau.</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-900">Le prix exact est-il confirmé à l&apos;avance ?</dt>
              <dd className="mt-1">Oui. Le véhicule et les pièces nécessaires sont pris en compte avant de valider les travaux.</dd>
            </div>
          </dl>
        </section>

        <CallButton />
      </div>
      <JsonLd data={faqData} />
      <JsonLd data={serviceData} />
    </div>
  );
}
