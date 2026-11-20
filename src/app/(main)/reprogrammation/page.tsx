"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CallButton } from "@/components/seo/seo-bits";
import { ADDRESS_LINE, HOURS_TEXT, PHONE_DISPLAY } from "@/lib/site-info";
import vehiclesRaw from "@/data/reprogrammation/vehicles.json";
import enginesRaw from "@/data/reprogrammation/engines.json";
import {
  ChevronRight,
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

type EngineData = {
  code: string;
  displacement: string;
  fuel: string;
  stock_hp: number;
  stock_nm: number;
  stage1: StageData;
};

type VehiclesFile = {
  vehicles: VehicleRecord[];
};

type EnginesFile = {
  engines: Record<string, EngineData>;
};

type ReprogTab = "stage1" | "fiabilite";

type InfoEntry = {
  title: string;
  summary: string;
  bullets: string[];
};

const STAGE_1_PRICE = 490;

const TAB_LABELS: Record<ReprogTab, string> = {
  stage1: "Stage 1",
  fiabilite: "Diagnostic et fiabilité",
};

const TAB_CONTENT: Record<ReprogTab, InfoEntry[]> = {
  stage1: [
    {
      title: "Stage 1",
      summary: "Le meilleur compromis performance / fiabilité pour un usage quotidien.",
      bullets: [
        "Optimisation du couple et de la puissance sans ouvrir le moteur",
        "Cartographie sur mesure selon ton moteur et ton carburant",
      ],
    },
  ],
  fiabilite: [
    {
      title: "Diagnostic avant tout",
      summary: "Toute étude commence par un diagnostic complet du véhicule.",
      bullets: [
        "Contrôle de l'état mécanique et des défauts enregistrés",
        "Réparation des pannes (FAP, EGR, AdBlue) avant toute reprogrammation",
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
  stockNm,
  stageNm,
}: {
  stockHp: number;
  stageHp: number;
  stockNm: number;
  stageNm: number;
}) {
  const chartWidth = 300;
  const chartHeight = 140;

  const hpStockCurve = [stockHp * 0.35, stockHp * 0.52, stockHp * 0.7, stockHp * 0.83, stockHp * 0.94, stockHp];
  const hpStageCurve = [stageHp * 0.36, stageHp * 0.56, stageHp * 0.76, stageHp * 0.9, stageHp * 0.97, stageHp];

  const nmStockCurve = [stockNm * 0.45, stockNm * 0.68, stockNm * 0.84, stockNm * 0.93, stockNm * 0.97, stockNm];
  const nmStageCurve = [stageNm * 0.47, stageNm * 0.72, stageNm * 0.88, stageNm * 0.96, stageNm * 0.99, stageNm];

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
          </svg>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Couple (Nm)</p>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28">
            <path d={buildCurvePath(nmStockCurve, chartWidth, chartHeight)} fill="none" stroke="#71717a" strokeWidth="3" />
            <path d={buildCurvePath(nmStageCurve, chartWidth, chartHeight)} fill="none" stroke="#ef4444" strokeWidth="3" />
          </svg>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-2"><span className="inline-block w-2 h-2 rounded-full bg-zinc-500 mr-2" />Origine</div>
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-2"><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" />Stage 1</div>
      </div>
    </article>
  );
}

export default function ReprogrammationPage() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariantKey, setSelectedVariantKey] = useState("");
  const [activeInfoTab, setActiveInfoTab] = useState<ReprogTab | null>(null);
  const modelMotorisationSectionRef = useRef<HTMLDivElement | null>(null);
  const motorisationSelectRef = useRef<HTMLSelectElement | null>(null);

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

  useEffect(() => {
    if (!selectedBrand || !modelMotorisationSectionRef.current) {
      return;
    }

    modelMotorisationSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedBrand]);

  useEffect(() => {
    if (!selectedModel || !motorisationSelectRef.current) {
      return;
    }

    motorisationSelectRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    motorisationSelectRef.current.focus();
  }, [selectedModel]);

  return (
    <div className="min-h-screen bg-zinc-100">
      <section className="relative overflow-hidden bg-brand-black text-white border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/15 via-transparent to-amber-500/10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-red-500/15 text-red-200 border border-red-500/25 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Garage à Gigean
          </div>

          <h1 className="text-3xl md:text-5xl font-black mt-4 leading-tight max-w-4xl">
            Perte de puissance, FAP, EGR :
            <span className="text-brand-red"> diagnostic et solution à Gigean</span>
          </h1>

          <p className="text-zinc-300 mt-4 max-w-3xl text-sm md:text-base">
            Mode dégradé, voyant antipollution ou AdBlue allumé ? Diagnostic à 50 €, nettoyage et réparation du FAP, de la vanne EGR et du circuit AdBlue. On ne supprime aucun système antipollution.
          </p>
          <div className="mt-6 max-w-md">
            <CallButton />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-8">
          <h2 className="text-xl md:text-2xl font-black text-zinc-900">FAP, EGR, AdBlue : on diagnostique avant de réparer</h2>
          <p className="mt-3 text-zinc-700 leading-relaxed">
            Perte de puissance, mode dégradé, fumée, voyant moteur ou message AdBlue : ces symptômes viennent souvent d&apos;un FAP encrassé, d&apos;une vanne EGR bloquée ou d&apos;un capteur défaillant. On lit les défauts à la valise, on contrôle les capteurs, puis on nettoie ou on répare. Le diagnostic coûte 50 € et il est déduit si la réparation est faite chez nous.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-zinc-800">
            <li><Link href="/fap-egr-adblue" className="underline font-semibold">Nettoyage FAP, EGR, AdBlue à Gigean</Link></li>
            <li><Link href="/diagnostic" className="underline font-semibold">Diagnostic voiture à Gigean</Link></li>
            <li><Link href="/tarifs" className="underline font-semibold">Nos tarifs</Link></li>
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl font-black text-zinc-900">Reprogrammation Stage 1</h2>
          <p className="mt-2 text-zinc-700">Sélectionne ton véhicule pour voir les gains estimés du Stage 1.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 md:p-6 mb-6 text-white">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-brand-red/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative">
            <h3 className="text-xl md:text-2xl font-black text-center">Nos reprogrammations</h3>

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
                  Note importante : nous ne désactivons pas les systèmes antipollution (FAP, EGR, AdBlue). Chaque reprogrammation est étudiée selon le véhicule, son usage et la réglementation applicable.
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
          <div ref={modelMotorisationSectionRef} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 md:p-6">
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
                  ref={motorisationSelectRef}
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
              Sélectionne ton véhicule pour afficher les tarifs et les options disponibles.
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
                </div>

                <CurveCard
                  stockHp={selectedEngine.stock_hp}
                  stageHp={selectedEngine.stage1.hp}
                  stockNm={selectedEngine.stock_nm}
                  stageNm={selectedEngine.stage1.nm}
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
                Pas de panique. On étudie la plupart des véhicules, même si ton modèle n&apos;est pas encore affiché. Catalogue mis à jour en continu. Pour ton cas précis, prends un <Link href="/mecanique" className="underline hover:text-blue-700">rendez-vous mécanique</Link>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 md:p-8 space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-zinc-900">Reprogrammation moteur à Gigean : comment ça se passe</h2>
            <p className="mt-3 text-zinc-700 leading-relaxed">
              YASSAUTO reprogramme les moteurs essence et diesel à Gigean, à quelques minutes de Montpellier, Sète et Frontignan. Une reprogrammation consiste à modifier la cartographie du calculateur moteur (injection, pression de turbo, avance) pour améliorer le couple et la puissance, sans toucher à la mécanique. Le résultat dépend de ton moteur, de son état et de ton carburant : c&apos;est pourquoi chaque dossier est étudié individuellement.
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-700">
              <li><strong>Diagnostic préalable</strong> : contrôle de l&apos;état du moteur et lecture des défauts enregistrés. Une panne se répare avant toute reprogrammation.</li>
              <li><strong>Lecture du calculateur</strong> et création d&apos;un fichier adapté à ton véhicule.</li>
              <li><strong>Écriture du fichier</strong> et vérifications de bon fonctionnement.</li>
              <li><strong>Essai et restitution</strong> : on t&apos;explique ce qui a été fait et ce que tu peux en attendre.</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-900">Stage 1 : {STAGE_1_PRICE} €</h3>
            <p className="mt-2 text-zinc-700 leading-relaxed">
              Le Stage 1 s&apos;applique à un véhicule de série, sans modification matérielle. Il optimise le couple et la puissance et améliore l&apos;agrément de conduite. Le gain varie selon la motorisation : les valeurs estimées de ton moteur s&apos;affichent dans le catalogue ci-dessus.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-900">Cadre légal et engagements</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-700">
              <li>Nous ne désactivons ni ne supprimons aucun système antipollution (FAP, EGR, catalyseur, AdBlue).</li>
              <li>Avant intervention, nous t&apos;informons des conséquences possibles sur la garantie constructeur, l&apos;assurance et la conformité du véhicule.</li>
              <li>La compatibilité est validée véhicule par véhicule : si une reprogrammation n&apos;est pas pertinente, on te le dit.</li>
              <li>Devis clair et prix annoncé avant toute intervention.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-900">Questions fréquentes</h3>
            <dl className="mt-3 space-y-4 text-zinc-700">
              <div>
                <dt className="font-semibold text-zinc-900">Quel gain avec un Stage 1 ?</dt>
                <dd>Cela dépend du moteur. Le catalogue affiche une estimation par motorisation ; le gain réel est confirmé après diagnostic.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">Ma voiture est-elle compatible ?</dt>
                <dd>La plupart des véhicules récents le sont. Si ton modèle n&apos;est pas listé, envoie-nous la marque, le modèle, l&apos;année et la motorisation.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">Où se fait la reprogrammation ?</dt>
                <dd>Au garage YASSAUTO, {ADDRESS_LINE}. Ouvert {HOURS_TEXT}. Téléphone : <a href="tel:0648380568" className="underline">{PHONE_DISPLAY}</a>.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
