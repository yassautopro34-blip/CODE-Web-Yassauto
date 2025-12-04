import React from "react";
import {
  MapPin,
  Laptop,
  Wrench,
  Car,
  FileCheck,
  ClipboardList,
  FileText,
} from "lucide-react";
import { SERVICE_ZONES } from "@/types";

export const ServiceDetails: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="bg-brand-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
          €
        </span>
        Tarifs & Ce qui est inclus
      </h2>

      <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm mb-8">
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-black text-brand-black">150€</span>
          <span className="text-zinc-500 ml-2">/ premier déplacement</span>
        </div>
        <p className="text-sm text-zinc-600 mb-6 border-b border-zinc-200 pb-4">
          Si le véhicule n&apos;est pas acheté, le prochain déplacement est à{" "}
          <strong>100€</strong>.
        </p>

        <ul className="space-y-6">
          <li className="flex gap-4">
            <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
              <MapPin className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">1. Déplacement inclus</h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Intervention à Montpellier et dans un rayon de 30 minutes, sans
                supplément. Déplacement directement au lieu du rendez-vous.
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
              <Laptop className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">
                2. Diagnostic électronique professionnel
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Lecture des défauts moteur, airbag, ABS, FAP, boîte, etc.
                Détection des anomalies non visibles à l’œil nu.
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
              <Wrench className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">
                3. Inspection mécanique complète
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Vérification des fuites, freins, suspensions, pneus, turbo,
                distribution, châssis… Évaluation précise de l’état général.
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
              <Car className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">
                4. Essai routier (si possible)
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Test moteur, accélération, freinage, direction, embrayage,
                vibrations. Analyse du comportement global.
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
              <FileCheck className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">
                5. Vérification de tous les documents
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Carte grise, contrôle technique, identités, factures, historique
                SIA. Contrôle de la conformité administrative.
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
              <ClipboardList className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">
                6. Devis mécanique fourni sur place
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Évaluation des réparations éventuelles. Devis réalisé par notre
                garage partenaire pour un coût réel et transparent.
              </p>
            </div>
          </li>

          <li className="flex gap-4">
            <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
              <FileText className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">
                7. Aide à la carte grise
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Assistance pour préparer les documents et aide pour réaliser la
                carte grise en ligne en votre nom.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="font-bold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-brand-red" /> Zones
          d&apos;intervention (Sans supplément)
        </h3>
        <div className="flex flex-wrap gap-2">
          {SERVICE_ZONES.map((zone) => (
            <span
              key={zone}
              className="bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full text-sm font-medium border border-zinc-200"
            >
              {zone}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
