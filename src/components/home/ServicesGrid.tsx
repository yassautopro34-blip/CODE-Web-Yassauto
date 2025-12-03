import React from "react";
import Link from "next/link";
import { Search, ShieldCheck, Wrench, ChevronRight } from "lucide-react";

export const ServicesGrid: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-brand-black mb-4">
            Mes Services
          </h2>
          <div className="w-20 h-1.5 bg-brand-red mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 shadow-lg hover:shadow-xl transition-shadow group">
            <div className="bg-brand-red/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
              <Search className="w-7 h-7 text-brand-red group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-3">Diagnostic Complet</h3>
            <p className="text-zinc-600 mb-6">
              Passage à la valise, inspection moteur, châssis, carrosserie. Rien
              n'est laissé au hasard lors de la visite.
            </p>
            <Link
              href="/accompagnement"
              className="text-brand-red font-bold flex items-center hover:underline"
            >
              En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 shadow-lg hover:shadow-xl transition-shadow group">
            <div className="bg-brand-red/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
              <ShieldCheck className="w-7 h-7 text-brand-red group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sécurisation Achat</h3>
            <p className="text-zinc-600 mb-6">
              Vérification des papiers, de l'historique et des factures. Évitez
              les vices cachés et les arnaques.
            </p>
            <Link
              href="/accompagnement"
              className="text-brand-red font-bold flex items-center hover:underline"
            >
              En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 shadow-lg hover:shadow-xl transition-shadow group">
            <div className="bg-brand-red/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
              <Wrench className="w-7 h-7 text-brand-red group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-3">Mécanique Générale</h3>
            <p className="text-zinc-600 mb-6">
              En partenariat avec <strong>Legna Auto</strong>. Entretien,
              réparation, devis rapide et transparent.
            </p>
            <Link
              href="/mecanique"
              className="text-brand-red font-bold flex items-center hover:underline"
            >
              Demander un devis <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
