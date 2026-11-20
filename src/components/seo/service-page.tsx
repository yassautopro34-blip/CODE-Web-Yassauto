import Link from "next/link";
import { Check } from "lucide-react";
import { SERVICES, getService, type Service } from "@/lib/services";
import { PUBLISHED_CITIES } from "@/lib/cities";
import { PRICE_NOTICE } from "@/lib/site-info";
import { Breadcrumbs, CallButton, JsonLd } from "@/components/seo/seo-bits";

export function ServicePage({ service }: { service: Service }) {
  const related = service.related.map((s) => getService(s)).filter((s): s is Service => Boolean(s));
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-800 bg-brand-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
          <Breadcrumbs dark items={[{ name: "Tarifs", path: "/tarifs" }, { name: service.name, path: `/${service.slug}` }]} />
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{service.h1}</h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-300 md:text-lg">{service.answer}</p>
          <p className="mt-3 text-sm text-zinc-400">Durée : {service.duration}</p>
          <div className="mt-6 max-w-md">
            <CallButton label="Appeler pour un créneau – 06 48 38 05 68" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 text-zinc-700 sm:px-6">
        <section>
          <h2 className="text-2xl font-black text-zinc-900">Ce qui est compris</h2>
          <ul className="mt-4 space-y-2">
            {service.included.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {service.guarantee && <p className="mt-4 leading-relaxed">{service.guarantee}</p>}
        </section>

        <section>
          <h2 className="text-2xl font-black text-zinc-900">Prix</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <table className="w-full text-left text-sm md:text-base">
              <tbody>
                {service.priceTable.map((row) => (
                  <tr key={row.label} className="border-b border-zinc-100 last:border-0">
                    <th scope="row" className="px-4 py-3 font-medium text-zinc-800">{row.label}</th>
                    <td className="px-4 py-3 text-right font-bold text-zinc-900">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs italic text-zinc-500">{PRICE_NOTICE}</p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-zinc-900">{service.when.title}</h2>
          <p className="mt-3 leading-relaxed">{service.when.text}</p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-zinc-900">Pourquoi chez YASSAUTO</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            {service.why.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-zinc-900">Questions fréquentes</h2>
          <dl className="mt-4 space-y-4">
            {service.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-zinc-900">{f.q}</dt>
                <dd className="mt-1">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-2xl font-black text-zinc-900">Voir aussi</h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/tarifs" className="underline">Tous nos tarifs</Link></li>
            {related.map((r) => (
              <li key={r.slug}><Link href={`/${r.slug}`} className="underline">{r.name} à Gigean</Link></li>
            ))}
          </ul>
          {PUBLISHED_CITIES.length > 0 && (
            <p className="mt-4 leading-relaxed">
              Clients de{" "}
              {PUBLISHED_CITIES.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && ", "}
                  <Link href={`/${c.slug}`} className="underline">{c.name}</Link>
                </span>
              ))}
              {" "}: le garage est à Gigean.
            </p>
          )}
          <p className="mt-4 text-sm text-zinc-500">
            Toutes nos prestations : {SERVICES.map((s, i) => (
              <span key={s.slug}>{i > 0 && " · "}<Link href={`/${s.slug}`} className="underline">{s.name}</Link></span>
            ))}
          </p>
        </section>

        <CallButton />
      </div>
      <JsonLd data={faqData} />
    </div>
  );
}
