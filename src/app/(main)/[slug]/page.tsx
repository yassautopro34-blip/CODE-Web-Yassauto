import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, getService } from "@/lib/services";
import { CITIES, getCity } from "@/lib/cities";
import { buildPageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/seo/service-page";
import { CityPage } from "@/components/seo/city-page";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return [...SERVICES.map((s) => ({ slug: s.slug })), ...CITIES.map((c) => ({ slug: c.slug }))];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (service) return buildPageMetadata({ path: `/${slug}`, title: service.title, description: service.description });
  const city = getCity(slug);
  if (city) return buildPageMetadata({ path: `/${slug}`, title: city.title, description: city.description });
  return {};
}

export default async function SeoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (service) return <ServicePage service={service} />;
  const city = getCity(slug);
  if (city) return <CityPage city={city} />;
  notFound();
}
