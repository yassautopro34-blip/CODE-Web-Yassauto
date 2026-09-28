"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Car, ChevronDown, X } from "lucide-react";

export function VehicleFilter({ facets }: { facets: { brand: string; models: { model: string; years: number[] }[] }[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const brand = params.get("marque") ?? "";
  const model = params.get("modele") ?? "";
  const year = params.get("annee") ?? "";
  const models = facets.find((f) => f.brand === brand)?.models ?? [];
  const years = models.find((item) => item.model === model)?.years ?? [];

  const go = (next: Record<string, string>) => {
    const q = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) q.set(k, v);
      else q.delete(k);
    }
    router.push(`/boutique${q.toString() ? `?${q}` : ""}`, { scroll: false });
  };

  const selectWrap = "relative flex-1 min-w-[140px]";
  const select =
    "w-full appearance-none bg-zinc-950/80 border border-zinc-700 focus:border-brand-red text-white rounded-xl pl-4 pr-10 py-3 text-sm font-semibold outline-none transition disabled:opacity-40";

  return (
    <div className="bg-white/[0.04] backdrop-blur border border-white/10 rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="flex items-center gap-2 text-white font-bold">
          <span className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center"><Car size={16} /></span>
          Mon véhicule
        </p>
        {brand && (
          <button onClick={() => go({ marque: "", modele: "", annee: "" })} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white">
            <X size={14} /> Effacer
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <div className={selectWrap}>
          <select className={select} value={brand} onChange={(e) => go({ marque: e.target.value, modele: "", annee: "" })}>
            <option value="">Marque</option>
            {facets.map((f) => <option key={f.brand} value={f.brand}>{f.brand}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
        <div className={selectWrap}>
          <select className={select} value={model} disabled={!brand} onChange={(e) => go({ modele: e.target.value, annee: "" })}>
            <option value="">Modèle</option>
            {models.map((item) => <option key={item.model} value={item.model}>{item.model}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
        {years.length > 0 && (
          <div className={selectWrap}>
            <select className={select} value={year} onChange={(e) => go({ annee: e.target.value })}>
              <option value="">Année</option>
              {years.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}
