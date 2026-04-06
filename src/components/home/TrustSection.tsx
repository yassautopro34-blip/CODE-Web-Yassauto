"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Shield, MapPin, FileSearch, ArrowRight } from "lucide-react";
import Image from "next/image";

// Images qui défilent - ajoute tes images dans /public/gallery/
const GALLERY_IMAGES = [
  "/img1.jpeg",
  "/img2.jpeg",
  "/img3.jpeg",
  "/img4.jpeg",
  // Pour ajouter d'autres images : copie-les dans public/gallery/ puis ajoute "/gallery/nomimage.jpg"
];

export const TrustSection: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Change d'image toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: FileSearch,
      title: "Transparence totale",
      desc: "État du véhicule détaillé"
    },
    {
      icon: Shield,
      title: "Devis gratuit",
      desc: "Diagnostic sur place inclus"
    },
    {
      icon: MapPin,
      title: "Déplacement inclus",
      desc: "Montpellier + 30km"
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-zinc-950 relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[100px] -translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 text-brand-red px-3 py-1 rounded-full text-xs font-bold mb-4">
              <CheckCircle2 className="w-3 h-3" />
              Pourquoi nous faire confiance
            </div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              La confiance,<br/>
              <span className="text-zinc-500">c&apos;est la base.</span>
            </h2>
            
            <p className="text-zinc-400 text-sm md:text-base mb-6 md:mb-8 max-w-md">
              YassAuto, c&apos;est une histoire de famille et de passion. 
              Transparence totale dans un milieu souvent opaque.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 md:mb-8">
              {features.map((feature, i) => (
                <div 
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-brand-red/30 transition-colors"
                >
                  <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-brand-red" />
                  </div>
                  <p className="text-white font-bold text-sm mb-0.5">{feature.title}</p>
                  <p className="text-zinc-500 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>

            <a
              href="https://maps.app.goo.gl/79vPS7FCQyuf3Pge6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-red font-bold text-sm hover:gap-3 transition-all"
            >
              Voir tous les avis
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Images avec défilement - visible sur TOUS les écrans */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {/* Colonne gauche */}
            <div className="space-y-3 md:space-y-4">
              {/* Image qui défile */}
              <div className="relative aspect-[3/4] rounded-2xl border border-zinc-800 overflow-hidden">
                {GALLERY_IMAGES.map((src, index) => (
                  <Image
                    key={src}
                    width={300}
                    height={400}
                    src={src}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                      index === currentImage ? "opacity-100" : "opacity-0"
                    }`}
                    alt={`Photo garage ${index + 1}`}
                  />
                ))}
                {/* Indicateurs */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {GALLERY_IMAGES.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === currentImage ? "bg-brand-red" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Stats */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 md:p-4 text-center">
                <p className="text-2xl md:text-3xl font-black text-white mb-0.5">500+</p>
                <p className="text-zinc-500 text-[10px] md:text-xs">Clients satisfaits</p>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-3 md:space-y-4 pt-6 md:pt-8">
              {/* Stats Google */}
              <div className="bg-brand-red rounded-xl p-3 md:p-4 text-center">
                <p className="text-2xl md:text-3xl font-black text-white mb-0.5">5.0</p>
                <p className="text-white/70 text-[10px] md:text-xs">Note Google</p>
              </div>
              
              {/* Deuxième image qui défile (décalée) */}
              <div className="relative aspect-[3/4] rounded-2xl border border-zinc-800 overflow-hidden">
                {GALLERY_IMAGES.map((src, index) => {
                  const offsetIndex = (index + 1) % GALLERY_IMAGES.length;
                  return (
                    <Image
                      key={src}
                      width={300}
                      height={400}
                      src={GALLERY_IMAGES[offsetIndex]}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        index === currentImage ? "opacity-100" : "opacity-0"
                      }`}
                      alt={`Photo travail ${index + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
