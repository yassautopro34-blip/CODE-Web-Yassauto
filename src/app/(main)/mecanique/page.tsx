"use client";
import React from "react";
import Link from "next/link";
import { CallButton } from "@/components/seo/seo-bits";
import { SERVICES } from "@/lib/services";
import { HOURS_SHORT, PRICE_NOTICE } from "@/lib/site-info";
import { useMechanics } from "@/hooks/useMechanics";
import { MechanicsForm } from "@/components/mechanics/MechanicsForm";
import { MechanicsSuccess } from "@/components/mechanics/MechanicsSuccess";

export default function Mecanique() {
  const { formData, submitted, updateFormData, handleSubmit, resetForm } =
    useMechanics();

  if (submitted) {
    return <MechanicsSuccess resetForm={resetForm} />;
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Compact Hero */}
      <div className="bg-brand-black text-white py-6 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">
              Mécanique auto à Gigean, toutes marques
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Service assuré par <strong className="text-white">YASSAUTO MKLF</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Disponible
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              3x/4x avec Oney*
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mx-auto mb-8 max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 text-center">
          <p className="text-sm text-zinc-500">Le plus rapide : le téléphone</p>
          <div className="mt-3">
            <CallButton className="py-5 text-xl" />
          </div>
          <p className="mt-3 text-sm text-zinc-700">Lundi-vendredi {HOURS_SHORT} · Prix annoncé avant travaux · 5,0 sur Google</p>
        </section>

        <section className="mx-auto mb-10 max-w-3xl">
          <h2 className="text-xl font-black text-zinc-900">Nos prestations et leurs prix</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-brand-red">
                  <span className="font-semibold text-zinc-900">{s.name} à Gigean</span>
                  <span className="block text-sm text-zinc-500">{s.priceLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs italic text-zinc-500">{PRICE_NOTICE}</p>
        </section>

        <div className="max-w-3xl mx-auto">
          <MechanicsForm
            formData={formData}
            updateFormData={updateFormData}
            handleSubmit={handleSubmit}
          />
        </div>

        <section className="max-w-3xl mx-auto mt-12 space-y-8 text-zinc-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-black text-zinc-900">Garage mécanique à Gigean, près de Montpellier</h2>
            <p className="mt-3">
              YASSAUTO est un garage indépendant installé à Gigean, à quelques minutes de Sète, Frontignan,
              Poussan et Montpellier. Nous assurons l&apos;entretien et la réparation de la plupart des
              marques et des motorisations, essence comme diesel. Chaque intervention commence par un
              échange clair : on t&apos;explique la panne, ce qu&apos;il faut vraiment faire et ce qui peut
              attendre, avec un devis annoncé avant de toucher à la voiture.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-zinc-900">Nos prestations d&apos;entretien et de réparation</h2>
            <ul className="mt-3 space-y-3">
              <li>
                <strong className="text-zinc-900">Vidange et entretien courant</strong> : huile moteur,
                filtres (huile, air, habitacle, carburant) et contrôle des niveaux selon les préconisations du
                constructeur.
              </li>
              <li>
                <strong className="text-zinc-900">Freinage</strong> : remplacement des plaquettes et des
                disques, contrôle des étriers et purge du liquide de frein.
              </li>
              <li>
                <strong className="text-zinc-900">Distribution et pompe à eau</strong> : un remplacement
                préventif évite la casse moteur, très coûteuse. Nous changeons le kit complet selon le
                kilométrage ou l&apos;âge.
              </li>
              <li>
                <strong className="text-zinc-900">Embrayage</strong> : remplacement du kit d&apos;embrayage,
                du volant moteur si nécessaire, et contrôle de la boîte de vitesses.
              </li>
              <li>
                <strong className="text-zinc-900">Diagnostic électronique</strong> : lecture des défauts à la
                valise, dont les pannes de FAP, d&apos;EGR et d&apos;AdBlue, pour réparer la cause plutôt que
                les symptômes.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-black text-zinc-900">Un diagnostic avant tout</h2>
            <p className="mt-3">
              Voyant moteur allumé, perte de puissance, bruit suspect : le diagnostic classique est à
              50&nbsp;€ (30&nbsp;€ pour les étudiants), et ce montant est déduit si les réparations sont
              faites chez nous. Tu sais ainsi précisément ce qui ne va pas avant de décider.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-zinc-900">Comment ça se passe</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Tu remplis le formulaire ci-dessus ou tu appelles le <a href="tel:0648380568" className="underline">06 48 38 05 68</a>.</li>
              <li>On identifie ton véhicule et ton besoin, puis on te confirme un créneau.</li>
              <li>Diagnostic et devis détaillé, validé par toi avant le début des travaux.</li>
              <li>Intervention, essai et remise du véhicule avec explication des travaux réalisés.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-black text-zinc-900">Pratique</h2>
            <p className="mt-3">
              Garage YASSAUTO, 7 rue André Marie Ampère, 34770 Gigean. Ouvert du lundi au vendredi, de 10h à
              21h. Paiement par carte, espèces ou en 3x/4x avec Oney selon éligibilité. Besoin d&apos;une
              pièce précise ? Consulte notre page <Link href="/pieces" className="underline">pièces auto</Link>,
              ou découvre la <Link href="/reprogrammation" className="underline">reprogrammation moteur</Link>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
