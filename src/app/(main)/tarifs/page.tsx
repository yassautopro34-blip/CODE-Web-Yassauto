import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { PRICE_NOTICE, HOURS_TEXT } from "@/lib/site-info";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumbs, CallButton } from "@/components/seo/seo-bits";

export const metadata = buildPageMetadata({
  path: "/tarifs",
  title: "Tarifs garage Gigean – Vidange, freins, distribution",
  description:
    "Nos prix TTC pièces et main-d'œuvre : vidange 80 €, plaquettes 60 €, distribution 349 €, embrayage 450 €. Garage à Gigean, sortie A9.",
});

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-800 bg-brand-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
          <Breadcrumbs dark items={[{ name: "Tarifs", path: "/tarifs" }]} />
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">Nos tarifs, affichés avant les travaux</h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-300 md:text-lg">
            Garage à Gigean, ouvert {HOURS_TEXT}. Chaque ligne renvoie vers la prestation détaillée.
          </p>
          <div className="mt-6 max-w-md">
            <CallButton />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
        {SERVICES.map((service) => (
          <section key={service.slug}>
            <h2 className="text-xl font-black text-zinc-900">
              <Link href={`/${service.slug}`} className="hover:underline">
                {service.name} à Gigean
              </Link>
            </h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <table className="w-full text-left text-sm md:text-base">
                <tbody>
                  {service.priceTable.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-100 last:border-0">
                      <th scope="row" className="px-4 py-3 font-medium text-zinc-800">
                        <Link href={`/${service.slug}`} className="hover:underline">{row.label}</Link>
                      </th>
                      <td className="px-4 py-3 text-right font-bold text-zinc-900">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        <p className="text-sm italic text-zinc-500">{PRICE_NOTICE}</p>
        <CallButton label="Appeler pour un prix exact – 06 48 38 05 68" />
      </div>
    </div>
  );
}
