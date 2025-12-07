import React from "react";
import { Award, CheckCircle, Briefcase } from "lucide-react";
import Image from "next/image";

export const AboutProfile: React.FC = () => {
  return (
    <div className="w-full md:w-1/3 flex flex-col gap-6">
      <div className="bg-zinc-100 p-2 rounded-2xl rotate-2 shadow-xl border border-zinc-200">
        <Image
          width={400}
          height={500}
          src="/img2.jpeg"
          alt="Yassine Portrait"
          className="w-full h-auto rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
        />
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
  );
};
