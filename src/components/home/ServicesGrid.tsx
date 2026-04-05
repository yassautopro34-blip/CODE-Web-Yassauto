import React from "react";
import Link from "next/link";
import { Package, Sparkles, Wrench, Car, ArrowRight, Phone, Shield, Clock, Zap, Settings, Gauge, ThermometerSun } from "lucide-react";

export const ServicesGrid: React.FC = () => {
  return (
    <section className="py-12 md:py-20 lg:py-28 bg-brand-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px)' }}></div>
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Compact mobile, plus grand desktop */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full mb-4 md:mb-5">
            <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse"></div>
            <span className="text-zinc-400 text-xs md:text-sm">Tous les services auto</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[0.95] mb-3 md:mb-5">
            Un souci avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">ta voiture ?</span>
          </h2>
          
          <p className="text-zinc-500 text-sm md:text-base lg:text-lg max-w-xl mx-auto mb-5 md:mb-7">
            Mécanique, pièces, custom ou accompagnement — <span className="text-zinc-300">on gère tout.</span>
          </p>

          <a 
            href="tel:0648380568" 
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white px-5 py-2.5 md:px-7 md:py-3.5 rounded-xl font-bold text-sm md:text-base transition-all"
          >
            <Phone className="w-4 h-4" />
            06 48 38 05 68
          </a>
        </div>

        {/* Grille responsive : 2 cols mobile, 12 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 lg:gap-5">
          
          {/* MÉCANIQUE - Full width mobile, 7 cols desktop */}
          <Link 
            href="/mecanique"
            className="col-span-2 lg:col-span-7 group bg-zinc-900/80 rounded-2xl lg:rounded-3xl overflow-hidden border border-zinc-800 hover:border-brand-red/30 transition-all"
          >
            <div className="p-5 md:p-6 lg:p-8">
              <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-5 lg:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-brand-red rounded-xl flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                    <Zap className="w-3 h-3 text-brand-red" />
                    <span className="text-brand-red text-[10px] md:text-xs font-bold uppercase">Principal</span>
                  </div>
                  <h3 className="text-lg md:text-2xl lg:text-3xl font-black text-white">Mécanique</h3>
                </div>
              </div>

              {/* Services en grid */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-5 lg:mb-6">
                {[
                  { icon: Settings, label: "Entretien" },
                  { icon: Gauge, label: "Diagnostic" },
                  { icon: Shield, label: "Freins" },
                  { icon: ThermometerSun, label: "Clim" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2">
                    <item.icon className="w-3 h-3 md:w-4 md:h-4 text-brand-red shrink-0" />
                    <span className="text-zinc-300 text-[11px] md:text-xs lg:text-sm">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-brand-red font-bold text-xs md:text-sm lg:text-base">Devis gratuit</span>
                <div className="w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-brand-red rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
                </div>
              </div>
            </div>
          </Link>

          {/* PIÈCES AUTO */}
          <Link 
            href="/pieces"
            className="col-span-1 lg:col-span-5 lg:row-span-2 group bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl lg:rounded-3xl p-4 md:p-5 lg:p-6 hover:scale-[1.02] transition-transform flex flex-col"
          >
            <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
              <Package className="w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 text-white" />
              <span className="flex items-center gap-1 bg-black/20 text-white text-[9px] md:text-[10px] lg:text-xs font-bold px-2 py-0.5 md:py-1 rounded-full">
                <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                48h
              </span>
            </div>
            <h3 className="text-sm md:text-lg lg:text-xl font-black text-white mb-1 lg:mb-2">Pièces</h3>
            <p className="text-white/70 text-[10px] md:text-xs lg:text-sm mb-2 md:mb-3 lg:mb-4 line-clamp-2 lg:line-clamp-none flex-1">
              Neuf ou occasion, meilleur prix
            </p>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* CUSTOMISATION */}
          <Link 
            href="/mecanique"
            className="col-span-1 lg:col-span-7 group bg-zinc-900 rounded-2xl lg:rounded-3xl p-4 md:p-5 lg:p-6 border border-zinc-800 hover:border-purple-500/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-purple-500/20 rounded-full blur-[40px] md:blur-[50px]"></div>
            <div className="relative">
              <Sparkles className="w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 text-purple-400 mb-2 md:mb-3 lg:mb-4" />
              <h3 className="text-sm md:text-lg lg:text-xl font-black text-white mb-1.5 md:mb-2">Custom</h3>
              <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2 md:mb-3 lg:mb-4">
                {["CarPlay", "LED", "Cover"].map((tag, i) => (
                  <span key={i} className="bg-purple-500/15 text-purple-300 text-[8px] md:text-[10px] lg:text-xs px-1.5 md:px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* ACCOMPAGNEMENT - Full width */}
          <Link 
            href="/accompagnement"
            className="col-span-2 lg:col-span-12 group bg-emerald-900/30 border border-emerald-800/40 rounded-2xl lg:rounded-3xl p-4 md:p-5 lg:p-6 flex items-center gap-3 md:gap-4 hover:border-emerald-500/50 transition-all"
          >
            <div className="w-11 h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-emerald-500 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                <h3 className="text-sm md:text-lg lg:text-xl font-black text-white">Achat / Vente</h3>
                <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400 shrink-0" />
              </div>
              <p className="text-emerald-200/60 text-[10px] md:text-xs lg:text-sm line-clamp-1 md:line-clamp-2">
                Je t&apos;accompagne pour éviter les arnaques
              </p>
            </div>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

        {/* Footer compact mobile, plus d'infos desktop */}
        <div className="mt-6 md:mt-10 lg:mt-12 pt-5 md:pt-6 border-t border-zinc-800/50">
          {/* Mobile: une ligne */}
          <div className="flex md:hidden flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-zinc-500">
            <span>📍 Gigean</span>
            <span>•</span>
            <span>⚡ Réponse 24h</span>
            <span>•</span>
            <span>💳 CB/Espèces</span>
          </div>
          
          {/* Desktop: stats */}
          <div className="hidden md:grid grid-cols-4 gap-6 lg:gap-8">
            {[
              { value: "500+", label: "Clients satisfaits", icon: "👥" },
              { value: "24h", label: "Réponse garantie", icon: "⚡" },
              { value: "34770", label: "Gigean & environs", icon: "📍" },
              { value: "7j/7", label: "Disponible", icon: "🕐" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl lg:text-3xl mb-1 lg:mb-2">{stat.icon}</div>
                <div className="text-xl lg:text-2xl font-black text-white mb-0.5">{stat.value}</div>
                <div className="text-zinc-500 text-xs lg:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
