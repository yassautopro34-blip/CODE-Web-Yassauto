import React from "react";
import Image from "next/image";

export const ContactMap: React.FC = () => {
  return (
    <div className="bg-zinc-200 rounded-2xl min-h-[400px] flex items-center justify-center relative overflow-hidden">
      <Image
        width={600}
        height={600}
        src="/background/2.png"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        alt="Map placeholder"
      />
      <div className="relative z-10 bg-white/90 backdrop-blur p-6 rounded-xl text-center">
        <h3 className="text-xl font-black text-brand-red mb-2">30 Minutes</h3>
        <p className="text-zinc-800 font-medium">
          Autour de Montpellier inclus
        </p>
      </div>
    </div>
  );
};
