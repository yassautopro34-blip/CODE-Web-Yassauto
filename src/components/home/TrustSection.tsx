import React from "react";
import Link from "next/link";
import { CheckCircle2, Shield, MapPin, FileSearch, ArrowRight } from "lucide-react";
import Image from "next/image";

export const TrustSection: React.FC = () => {
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

            <Link 
              href="/propos"
              className="inline-flex items-center gap-2 text-brand-red font-bold text-sm hover:gap-3 transition-all"
            >
              Découvrir notre histoire
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Images - hidden on mobile, simplified */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Image
                width={300}
                height={300}
                src="/img1.jpeg"
                className="rounded-2xl border border-zinc-800 w-full object-cover"
                alt="Inspection engine"
              />
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-white mb-1">500+</p>
                <p className="text-zinc-500 text-xs">Clients satisfaits</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-brand-red rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-white mb-1">5.0</p>
                <p className="text-white/70 text-xs">Note Google</p>
              </div>
              <Image
                width={300}
                height={300}
                src="/img4.jpeg"
                className="rounded-2xl border border-zinc-800 w-full object-cover"
                alt="Happy client"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
