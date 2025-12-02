import React from 'react';
import { Award, Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
       <div className="bg-brand-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-5xl font-black mb-4">À Propos de YassAuto</h1>
            <p className="text-xl text-zinc-400">Expertise technique, transparence et sécurité.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
         <div className="flex flex-col md:flex-row gap-12 items-start">
            
            {/* Colonne Image / Badges */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div className="bg-zinc-100 p-2 rounded-2xl rotate-2 shadow-xl border border-zinc-200">
                   <img src="https://picsum.photos/400/500?grayscale" alt="Yassine Portrait" className="w-full h-auto rounded-xl grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                        <Award className="w-5 h-5 text-brand-red mr-2" />
                        Parcours & Diplômes
                    </h3>
                    <ul className="space-y-3 text-sm text-zinc-600">
                        <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                            <span>Bac Scientifique</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                            <span>Bac Pro Mécanique</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                            <span>Double CAP Spécialisé</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center">
                        <Briefcase className="w-5 h-5 text-brand-red mr-2" />
                        Expérience Garage
                    </h3>
                    <ul className="space-y-3 text-sm text-zinc-600">
                        <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mr-2"></div>
                            AD Garage
                        </li>
                        <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mr-2"></div>
                            Carter Cash
                        </li>
                        <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full mr-2"></div>
                            Legna Auto
                        </li>
                    </ul>
                </div>
            </div>
            
            {/* Colonne Texte */}
            <div className="w-full md:w-2/3 prose prose-lg text-zinc-600">
                <h2 className="text-3xl font-black text-brand-black mb-6">YASSAUTO</h2>
                <p>
                    YASSAUTO est né d’un constat simple : beaucoup de personnes achètent des voitures d’occasion sans véritable expertise mécanique, et se retrouvent confrontées à des vices cachés, des réparations coûteuses ou des véhicules mal entretenus.
                </p>
                
                <h3 className="text-xl font-bold text-brand-black mt-8 mb-4">Un Parcours Solide</h3>
                <p>
                    Après un parcours solide en mécanique — <strong>Bac Scientifique, Bac Pro Mécanique, deux CAP spécialisés</strong> — et plusieurs années d’expérience en garage (AD Garage, Carter Cash, Legna Auto), Yassine a été confronté quotidiennement à ces situations : clients mal informés, diagnostics bâclés, véhicules maquillés, problèmes non déclarés.
                </p>

                <h3 className="text-xl font-bold text-brand-black mt-8 mb-4">Notre Solution</h3>
                <p>
                    Face à ce besoin réel, YASSAUTO a été créé pour apporter une solution claire : 
                    <span className="block mt-2 pl-4 border-l-4 border-brand-red bg-zinc-50 py-2 pr-2 italic font-medium text-zinc-800">
                        Accompagner les acheteurs, vérifier les véhicules sur place, diagnostiquer professionnellement, et sécuriser totalement l’achat.
                    </span>
                </p>

                <h3 className="text-xl font-bold text-brand-black mt-8 mb-4">L'Objectif</h3>
                <p>
                    L’objectif est simple : offrir un service <strong>transparent, technique et fiable</strong>, afin que chacun puisse acheter son véhicule en confiance, sans risque et avec toutes les informations en main.
                </p>
                
                <div className="flex items-center mt-8 bg-brand-black text-white p-6 rounded-xl shadow-lg">
                    <ShieldCheck className="w-10 h-10 text-brand-red mr-4 shrink-0" />
                    <p className="text-sm md:text-base font-medium m-0 text-white">
                        YASSAUTO met aujourd’hui son expertise de terrain au service du public, avec une approche professionnelle, pédagogique et accessible.
                    </p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};