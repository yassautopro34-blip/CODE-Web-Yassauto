import React from "react";

export const ContactHero: React.FC = () => {
  return (
    <div className="bg-brand-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-black mb-4">Contactez-nous</h1>
        <p className="text-xl text-zinc-400">
          Une question ? Un doute ? On est là.
        </p>
      </div>
    </div>
  );
};
