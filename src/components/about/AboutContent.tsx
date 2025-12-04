import React from "react";
import { ShieldCheck } from "lucide-react";

export const AboutContent: React.FC = () => {
  return (
    <div className="w-full md:w-2/3 prose prose-lg text-zinc-600">
      <h2 className="text-3xl font-black text-brand-black mb-6">YASSAUTO</h2>
      <p>
        YASSAUTO est né d’un constat simple : beaucoup de personnes achètent des
        voitures d’occasion sans véritable expertise mécanique, et se retrouvent
        confrontées à des vices cachés, des réparations coûteuses ou des
        véhicules mal entretenus.
      </p>

      <h3 className="text-xl font-bold text-brand-black mt-8 mb-4">
        Un Parcours Solide
      </h3>
      <p>
        Après un parcours solide en mécanique —{" "}
        <strong>Bac Scientifique, Bac Pro Mécanique, deux CAP spécialisés</strong>{" "}
        — et plusieurs années d’expérience en garage (AD Garage, Carter Cash,
        Legna Auto), Yassine a été confronté quotidiennement à ces situations :
        clients mal informés, diagnostics bâclés, véhicules maquillés, problèmes
        non déclarés.
      </p>

      <h3 className="text-xl font-bold text-brand-black mt-8 mb-4">
        Notre Solution
      </h3>
      <p>
        Face à ce besoin réel, YASSAUTO a été créé pour apporter une solution
        claire :
        <span className="block mt-2 pl-4 border-l-4 border-brand-red bg-zinc-50 py-2 pr-2 italic font-medium text-zinc-800">
          Accompagner les acheteurs, vérifier les véhicules sur place,
          diagnostiquer professionnellement, et sécuriser totalement l’achat.
        </span>
      </p>

      <h3 className="text-xl font-bold text-brand-black mt-8 mb-4">
        L&apos;Objectif
      </h3>
      <p>
        L’objectif est simple : offrir un service{" "}
        <strong>transparent, technique et fiable</strong>, afin que chacun
        puisse acheter son véhicule en confiance, sans risque et avec toutes les
        informations en main.
      </p>

      <div className="flex items-center mt-8 bg-brand-black text-white p-6 rounded-xl shadow-lg">
        <ShieldCheck className="w-10 h-10 text-brand-red mr-4 shrink-0" />
        <p className="text-sm md:text-base font-medium m-0 text-white">
          YASSAUTO met aujourd’hui son expertise de terrain au service du
          public, avec une approche professionnelle, pédagogique et accessible.
        </p>
      </div>
    </div>
  );
};
