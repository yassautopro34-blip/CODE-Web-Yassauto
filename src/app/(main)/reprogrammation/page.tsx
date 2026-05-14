"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import vehiclesRaw from "@/data/reprogrammation/vehicles.json";
import enginesRaw from "@/data/reprogrammation/engines.json";
import {
  ChevronRight,
  Flame,
  Gauge,
  TrendingUp,
  Wrench,
  AlertCircle,
} from "lucide-react";

type VehicleRecord = {
  brand: string;
  model: string;
  years: string;
  trim: string;
  engine_id: string;
};

type StageData = {
  hp: number;
  nm: number;
};

type EthanolData = StageData & {
  available: boolean;
};

type EngineData = {
  code: string;
  displacement: string;
  fuel: string;
  stock_hp: number;
  stock_nm: number;
  stage1: StageData;
  ethanol: EthanolData;
};

type VehiclesFile = {
  vehicles: VehicleRecord[];
};

type EnginesFile = {
  engines: Record<string, EngineData>;
};

type ReprogTab = "stages" | "echappement" | "options" | "fiabilisation";

type InfoEntry = {
  title: string;
  summary: string;
  bullets: string[];
};

const STAGE_1_PRICE = 490;
const ETHANOL_PRICE = 590;

const TAB_LABELS: Record<ReprogTab, string> = {
  stages: "Stages perf",
  echappement: "Echappement",
  options: "Fonctions",
  fiabilisation: "Fiabilisation",
};

const TAB_CONTENT: Record<ReprogTab, InfoEntry[]> = {
  stages: [
    {
      title: "Stage 1",
      summary: "Le meilleur compromis perf / fiabilité pour un usage quotidien.",
      bullets: [
        "Optimisation couple + puissance sans ouvrir le moteur",
        "Cartographie sur mesure selon ton moteur et ton carburant",
      ],
    },
    {
      title: "Stage 2",
      summary: "Le vrai cap perf apres Stage 1.",
      bullets: [
        "Admission dynamique + ligne sport",
        "Cartographie sur mesure pour exploiter le hardware",
      ],
    },
    {
      title: "Stage 3",
      summary: "Preparation lourde orientee gros objectifs.",
      bullets: [
        "Turbo et injecteurs uprates",
        "Renfort moteur possible + mise au point complete",
      ],
    },
  ],
  echappement: [
    {
      title: "Downpipe",
      summary: "Piece cle pour liberer la sortie turbo.",
      bullets: [
        "Moins de contre-pression, spool plus rapide",
        "Gestion moteur recalibree pour rester propre",
      ],
    },
    {
      title: "Cat-Back",
      summary: "Sonorite plus agressive, style plus racing.",
      bullets: [
        "Ligne apres catalyseur",
        "Setup adapte a ton usage route/plaisir",
      ],
    },
  ],
  options: [
    {
      title: "Pop & Bang / Hard Limiter",
      summary: "Effet sonore et caractere moteur plus radical.",
      bullets: [
        "Reglage rupteur selon niveau souhaite",
        "Calibration propre pour garder un comportement maitrisable",
      ],
    },
    {
      title: "Launch Control / Multimap",
      summary: "Fonctions avancees pour usage sport et daily.",
      bullets: [
        "Launch controle pour departs repetables",
        "Multimap Eco/Sport/E85 selon vehicule",
      ],
    },
  ],
  fiabilisation: [
    {
      title: "FAP / DPF",
      summary: "Problemes classiques: colmatage, mode degrade, manque de souffle.",
      bullets: [
        "Diagnostic regen et contre-pression",
        "Strategie de gestion adaptee a ton roulage",
      ],
    },
    {
      title: "EGR / AdBlue",
      summary: "Encrassement, defauts capteurs et pannes couteuses.",
      bullets: [
        "Controle complet des systemes",
        "Solution logicielle ciblee selon symptomes reels",
      ],
    },
  ],
};

const allVehicles = (vehiclesRaw as VehiclesFile).vehicles;
const enginesById = (enginesRaw as EnginesFile).engines;

const BRAND_LOGO_DOMAINS: Record<string, string> = {
  Audi: "audi.com",
  BMW: "bmw.com",
  Citroen: "citroen.fr",
  Dacia: "dacia.fr",
  DS: "dsautomobiles.fr",
  Fiat: "fiat.com",
  Ford: "ford.com",
  Hyundai: "hyundai.com",
  Kia: "kia.com",
  Mercedes: "mercedes-benz.com",
  Opel: "opel.com",
  Peugeot: "peugeot.fr",
  Renault: "renault.fr",
  Seat: "seat.com",
  Skoda: "skoda-auto.com",
  Volkswagen: "volkswagen.com",
};

function getLogoUrl(brand: string) {
  const domain = BRAND_LOGO_DOMAINS[brand];
  return domain ? `https://logo.clearbit.com/${domain}` : "";
}

function BrandLogo({ brand }: { brand: string }) {
  const [failed, setFailed] = useState(false);
  const logoUrl = getLogoUrl(brand);
  const initials = brand.slice(0, 2).toUpperCase();

  if (!logoUrl || failed) {
    return (
      <div className="h-7 w-7 rounded-full bg-zinc-200 text-zinc-700 grid place-items-center text-[10px] font-black">
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={`Logo ${brand}`}
      className="h-7 w-7 rounded-full bg-white object-contain"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

function buildCurvePath(values: number[], chartWidth: number, chartHeight: number) {
  const maxValue = Math.max(...values) * 1.08;
  const stepX = chartWidth / (values.length - 1);

  return values
    .map((value, index) => {
      const x = index * stepX;
      const y = chartHeight - (value / maxValue) * chartHeight;
      const command = index === 0 ? "M" : "L";
      return `${command}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function CurveCard({
  stockHp,
  stageHp,
  ethanolHp,
  stockNm,
  stageNm,
  ethanolNm,
}: {
  stockHp: number;
  stageHp: number;
  ethanolHp: number | null;
  stockNm: number;
  stageNm: number;
  ethanolNm: number | null;
}) {
  const chartWidth = 300;
  const chartHeight = 140;

  const hpStockCurve = [stockHp * 0.35, stockHp * 0.52, stockHp * 0.7, stockHp * 0.83, stockHp * 0.94, stockHp];
  const hpStageCurve = [stageHp * 0.36, stageHp * 0.56, stageHp * 0.76, stageHp * 0.9, stageHp * 0.97, stageHp];
  const hpEthanolCurve = ethanolHp
    ? [ethanolHp * 0.36, ethanolHp * 0.58, ethanolHp * 0.78, ethanolHp * 0.92, ethanolHp * 0.98, ethanolHp]
    : null;

  const nmStockCurve = [stockNm * 0.45, stockNm * 0.68, stockNm * 0.84, stockNm * 0.93, stockNm * 0.97, stockNm];
  const nmStageCurve = [stageNm * 0.47, stageNm * 0.72, stageNm * 0.88, stageNm * 0.96, stageNm * 0.99, stageNm];
  const nmEthanolCurve = ethanolNm
    ? [ethanolNm * 0.48, ethanolNm * 0.74, ethanolNm * 0.89, ethanolNm * 0.97, ethanolNm, ethanolNm]
    : null;

  return (
    <article className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 md:p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-red-400" />
          Courbes de gains
        </h4>
        <span className="text-[11px] uppercase tracking-wide text-zinc-400">Visuel</span>
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Puissance (ch)</p>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28">
            <path d={buildCurvePath(hpStockCurve, chartWidth, chartHeight)} fill="none" stroke="#71717a" strokeWidth="3" />
            <path d={buildCurvePath(hpStageCurve, chartWidth, chartHeight)} fill="none" stroke="#ef4444" strokeWidth="3" />
            {hpEthanolCurve && (
              <path d={buildCurvePath(hpEthanolCurve, chartWidth, chartHeight)} fill="none" stroke="#10b981" strokeWidth="3" />
            )}
          </svg>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Couple (Nm)</p>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28">
            <path d={buildCurvePath(nmStockCurve, chartWidth, chartHeight)} fill="none" stroke="#71717a" strokeWidth="3" />
            <path d={buildCurvePath(nmStageCurve, chartWidth, chartHeight)} fill="none" stroke="#ef4444" strokeWidth="3" />
            {nmEthanolCurve && (
              <path d={buildCurvePath(nmEthanolCurve, chartWidth, chartHeight)} fill="none" stroke="#10b981" strokeWidth="3" />
            )}
          </svg>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-2"><span className="inline-block w-2 h-2 rounded-full bg-zinc-500 mr-2" />Origine</div>
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-2"><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" />Stage 1</div>
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-2"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2" />E85</div>
      </div>
    </article>
  );
}

export default function ReprogrammationPage() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariantKey, setSelectedVariantKey] = useState("");
  const [activeInfoTab, setActiveInfoTab] = useState<ReprogTab | null>(null);

  const brands = useMemo(() => {
    return [...new Set(allVehicles.map((v) => v.brand))].sort((a, b) => a.localeCompare(b, "fr"));
  }, []);

  const models = useMemo(() => {
    if (!selectedBrand) {
      return [];
    }

    return [...new Set(allVehicles.filter((v) => v.brand === selectedBrand).map((v) => v.model))].sort((a, b) =>
      a.localeCompare(b, "fr")
    );
  }, [selectedBrand]);

  const variants = useMemo(() => {
    if (!selectedBrand || !selectedModel) {
      return [];
    }

    return allVehicles.filter((v) => v.brand === selectedBrand && v.model === selectedModel);
  }, [selectedBrand, selectedModel]);

  const selectedVehicle = useMemo(() => {
    if (!selectedVariantKey) {
      return null;
    }

    return (
      variants.find((vehicle) => {
        const key = `${vehicle.brand}|${vehicle.model}|${vehicle.years}|${vehicle.trim}|${vehicle.engine_id}`;
        return key === selectedVariantKey;
      }) ?? null
    );
  }, [selectedVariantKey, variants]);

  const selectedEngine = selectedVehicle ? enginesById[selectedVehicle.engine_id] : null;

  const resetModelAndVariant = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedVariantKey("");
  };

  const resetVariant = (model: string) => {
    setSelectedModel(model);
    setSelectedVariantKey("");
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <section className="relative overflow-hidden bg-brand-black text-white border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/15 via-transparent to-amber-500/10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-red-500/15 text-red-200 border border-red-500/25 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Nouveau service performance
          </div>

          <h1 className="text-3xl md:text-5xl font-black mt-4 leading-tight max-w-4xl">
            Reprogrammation moteur
            <span className="text-brand-red"> Stage 1</span>
            <span className="text-zinc-300"> et conversion E85</span>
          </h1>

          <p className="text-zinc-300 mt-4 max-w-3xl text-sm md:text-base">
            Sélectionne ton véhicule et découvre instantanément les gains en puissance et en couple.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 md:p-6 mb-6 text-white">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-brand-red/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative">
            <h3 className="text-xl md:text-2xl font-black text-center">Les différentes reprog</h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(TAB_LABELS) as ReprogTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveInfoTab((prev) => (prev === tab ? null : tab))}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    activeInfoTab === tab
                      ? "bg-gradient-to-r from-brand-red to-orange-500 text-white border-transparent shadow-lg shadow-red-950/40"
                      : "bg-zinc-900/70 text-zinc-300 border-zinc-700 hover:border-orange-400 hover:text-white"
                  }`}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {activeInfoTab && (
              <>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TAB_CONTENT[activeInfoTab].map((entry) => (
                    <article key={entry.title} className="rounded-2xl border border-zinc-700 bg-zinc-900/75 p-4">
                      <h4 className="font-black text-white text-lg">{entry.title}</h4>
                      <p className="text-sm text-zinc-300 mt-2">{entry.summary}</p>
                      <ul className="mt-3 space-y-1.5">
                        {entry.bullets.map((point) => (
                          <li key={point} className="text-sm text-zinc-200 flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-zinc-950 border border-zinc-700 p-4">
                  <p className="text-sm text-zinc-200">
                    Chaque cas est unique. Pour connaître la meilleure config selon ton usage, on te fait un diagnostic personnalisé au garage.
                  </p>
                </div>

                <p className="mt-3 text-xs text-zinc-400">
                  Note importante: certaines modifications sont destinées à la fiabilisation ou à un usage circuit/terrain privé et peuvent affecter l&apos;homologation route.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-zinc-900 mb-5">Étape 1 : Choisis ta marque</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => resetModelAndVariant(brand)}
                className={`group rounded-2xl border-2 p-4 text-center transition-all ${
                  selectedBrand === brand
                    ? "border-brand-red bg-red-50 shadow-lg"
                    : "border-zinc-200 bg-white hover:border-brand-red hover:bg-red-50/50"
                }`}
              >
                <div className="text-lg font-black text-zinc-900">{brand}</div>
                <p className="text-xs text-zinc-500 mt-1">Cliquer pour sélectionner</p>
              </button>
            ))}
          </div>
        </div>

        {selectedBrand && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 mb-5">Étape 2 &amp; 3 : Modèle et motorisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Modèle</span>
                <select
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm disabled:bg-zinc-100 disabled:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  value={selectedModel}
                  disabled={!selectedBrand}
                  onChange={(e) => resetVariant(e.target.value)}
                >
                  <option value="">Choisir un modèle</option>
                  {models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Motorisation</span>
                <select
                  className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm disabled:bg-zinc-100 disabled:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  value={selectedVariantKey}
                  disabled={!selectedModel}
                  onChange={(e) => setSelectedVariantKey(e.target.value)}
                >
                  <option value="">Choisir une version</option>
                  {variants.map((vehicle) => {
                    const key = `${vehicle.brand}|${vehicle.model}|${vehicle.years}|${vehicle.trim}|${vehicle.engine_id}`;
                    return <option key={key} value={key}>{vehicle.trim} - {vehicle.years}</option>;
                  })}
                </select>
              </label>
            </div>
          </div>
        )}

        <div className="mt-6">
          {!selectedVehicle && (
            <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-8 md:p-10 text-center text-zinc-500">
              Sélectionne ton véhicule pour afficher les gains et les tarifs.
            </div>
          )}

          {selectedVehicle && !selectedEngine && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 text-sm">
              Données moteur introuvables pour cette version. Contacte-nous pour une estimation manuelle.
            </div>
          )}

          {selectedVehicle && selectedEngine && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 md:p-6">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div className="flex items-start gap-3">
                    <BrandLogo brand={selectedVehicle.brand} />
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-zinc-900">{selectedVehicle.brand} {selectedVehicle.model}</h3>
                      <p className="text-zinc-500 text-sm mt-1">{selectedVehicle.trim} – {selectedVehicle.years}</p>
                      <p className="text-zinc-500 text-sm">Code moteur {selectedEngine.code} ({selectedEngine.displacement})</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        selectedEngine.fuel === "diesel"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }`}
                    >
                      {selectedEngine.fuel}
                    </span>
                    <span className="text-xs text-zinc-500 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-full">{selectedVehicle.engine_id}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <article className="bg-white rounded-2xl border border-zinc-200 p-5 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-brand-red" /><h4 className="font-bold text-zinc-900">Stage 1</h4></div>
                      <span className="text-sm font-black text-brand-red">{STAGE_1_PRICE} EUR</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                        <p className="text-zinc-500 uppercase text-[11px] font-semibold">Puissance</p>
                        <p className="text-zinc-900 font-bold mt-1">{selectedEngine.stock_hp} ch {"->"} {selectedEngine.stage1.hp} ch</p>
                        <p className="text-green-700 font-semibold text-xs mt-1">+{selectedEngine.stage1.hp - selectedEngine.stock_hp} ch</p>
                      </div>
                      <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                        <p className="text-zinc-500 uppercase text-[11px] font-semibold">Couple</p>
                        <p className="text-zinc-900 font-bold mt-1">{selectedEngine.stock_nm} Nm {"->"} {selectedEngine.stage1.nm} Nm</p>
                        <p className="text-green-700 font-semibold text-xs mt-1">+{selectedEngine.stage1.nm - selectedEngine.stock_nm} Nm</p>
                      </div>
                    </div>
                  </article>

                  <article className="bg-white rounded-2xl border border-zinc-200 p-5 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-emerald-600" /><h4 className="font-bold text-zinc-900">Passage E85</h4></div>
                      <span className="text-sm font-black text-emerald-600">{ETHANOL_PRICE} EUR</span>
                    </div>

                    {selectedEngine.ethanol.available ? (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                          <p className="text-zinc-500 uppercase text-[11px] font-semibold">Puissance</p>
                          <p className="text-zinc-900 font-bold mt-1">{selectedEngine.stock_hp} ch {"->"} {selectedEngine.ethanol.hp} ch</p>
                          <p className="text-green-700 font-semibold text-xs mt-1">+{selectedEngine.ethanol.hp - selectedEngine.stock_hp} ch</p>
                        </div>
                        <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                          <p className="text-zinc-500 uppercase text-[11px] font-semibold">Couple</p>
                          <p className="text-zinc-900 font-bold mt-1">{selectedEngine.stock_nm} Nm {"->"} {selectedEngine.ethanol.nm} Nm</p>
                          <p className="text-green-700 font-semibold text-xs mt-1">+{selectedEngine.ethanol.nm - selectedEngine.stock_nm} Nm</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-xl p-3">Conversion E85 non disponible sur cette motorisation.</p>
                    )}
                  </article>
                </div>

                <CurveCard
                  stockHp={selectedEngine.stock_hp}
                  stageHp={selectedEngine.stage1.hp}
                  ethanolHp={selectedEngine.ethanol.available ? selectedEngine.ethanol.hp : null}
                  stockNm={selectedEngine.stock_nm}
                  stageNm={selectedEngine.stage1.nm}
                  ethanolNm={selectedEngine.ethanol.available ? selectedEngine.ethanol.nm : null}
                />
              </div>

              <div className="bg-brand-black text-white rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Étape suivante</p>
                  <h5 className="text-xl font-black mt-1">Prendre rendez-vous pour valider l&apos;intervention</h5>
                  <p className="text-zinc-400 text-sm mt-1">Tu seras redirigé vers la page RDV mécanique.</p>
                </div>
                <Link href="/mecanique" className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 transition-colors px-5 py-3 rounded-xl font-bold">
                  <Wrench className="w-4 h-4" />
                  Prendre RDV
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5 md:p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">Ton véhicule n&apos;est pas dans le catalogue ?</h3>
              <p className="text-blue-800 text-sm md:text-base">
                Pas de panique. On reprog quasiment tout, même si ton modèle n&apos;est pas encore affiché. Catalogue mis à jour en continu. Pour ton cas précis, prends un <Link href="/mecanique" className="underline hover:text-blue-700">rendez-vous mécanique</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
