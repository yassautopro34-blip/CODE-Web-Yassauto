import Link from "next/link";
import { Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL, SITE_URL } from "@/lib/site-info";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function CallButton({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <a
      href={`tel:${PHONE_TEL}`}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-lg font-bold text-white transition hover:bg-emerald-700 ${className}`}
    >
      <Phone className="h-5 w-5" aria-hidden="true" />
      {label ?? `Appeler le garage – ${PHONE_DISPLAY}`}
    </a>
  );
}

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  const all: Crumb[] = [{ name: "Accueil", path: "/" }, ...items];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "/" : c.path}`,
    })),
  };
  return (
    <>
      <nav aria-label="Fil d'Ariane" className={`text-sm ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">›</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className={dark ? "text-white" : "text-zinc-800"}>{c.name}</span>
              ) : (
                <Link href={c.path} className="hover:underline">{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={data} />
    </>
  );
}

export function StickyCallBar() {
  return (
    <a
      href={`tel:${PHONE_TEL}`}
      className="fixed inset-x-0 bottom-0 z-50 bg-emerald-600 py-4 text-center text-lg font-bold text-white md:hidden"
    >
      Appeler – {PHONE_DISPLAY}
    </a>
  );
}
