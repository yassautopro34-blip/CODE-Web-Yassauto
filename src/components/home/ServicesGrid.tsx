import React from "react";
import Link from "next/link";
import { Package, Sparkles, Wrench, ChevronRight, Star, Car } from "lucide-react";

export const ServicesGrid: React.FC = () => {
  const services = [
    {
      icon: Package,
      title: "Pièces Auto",
      description: "Pièces neuves ou d'occasion à prix compétitif. Devis gratuit sous 24h, livraison rapide.",
      link: "/pieces",
      linkText: "Commander une pièce",
      gradient: "from-orange-500 to-amber-500",
      bgGlow: "bg-orange-500/20",
      delay: "0ms",
    },
    {
      icon: Sparkles,
      title: "Customisation",
      description: "CarPlay, ciel étoilé, covering... Personnalise ton véhicule avec style et qualité pro.",
      link: "/mecanique",
      linkText: "Demander un devis",
      gradient: "from-purple-500 to-pink-500",
      bgGlow: "bg-purple-500/20",
      delay: "100ms",
    },
    {
      icon: Car,
      title: "Achat / Revente",
      description: "Accompagnement pour ton achat ou ta vente. Inspection, négociation, sécurisation.",
      link: "/contact",
      linkText: "Me contacter",
      gradient: "from-emerald-500 to-teal-500",
      bgGlow: "bg-emerald-500/20",
      delay: "200ms",
    },
    {
      icon: Wrench,
      title: "Mécanique Générale",
      description: "Entretien, réparation, diagnostic. Devis transparent et intervention rapide.",
      link: "/mecanique",
      linkText: "Demander un devis",
      gradient: "from-brand-red to-red-600",
      bgGlow: "bg-red-500/20",
      delay: "300ms",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-zinc-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header animé */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
            <Star className="w-4 h-4" />
            Nos prestations
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-brand-black mb-4">
            Mes Services
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-brand-red to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Cards avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-3xl border border-zinc-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: service.delay }}
            >
              {/* Glow effect on hover */}
              <div className={`absolute -inset-px ${service.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative">
                {/* Icon avec gradient */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Titre avec underline animée */}
                <h3 className="text-2xl font-black mb-3 relative inline-block">
                  {service.title}
                  <span className={`absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r ${service.gradient} rounded-full group-hover:w-full transition-all duration-300`}></span>
                </h3>
                
                <p className="text-zinc-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                {/* CTA animé */}
                <Link
                  href={service.link}
                  className={`inline-flex items-center gap-2 font-bold text-transparent bg-clip-text bg-gradient-to-r ${service.gradient} group-hover:gap-3 transition-all duration-300`}
                >
                  {service.linkText}
                  <ChevronRight className={`w-5 h-5 text-current opacity-70 group-hover:opacity-100 transition-all`} style={{ color: index === 0 ? '#f97316' : index === 1 ? '#a855f7' : index === 2 ? '#10b981' : '#dc2626' }} />
                </Link>
              </div>
              
              {/* Decorative corner */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${service.gradient} opacity-5 rounded-bl-[100px] rounded-tr-3xl`}></div>
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center mt-12 gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-brand-red animate-bounce" style={{ animationDelay: '450ms' }}></div>
        </div>
      </div>
    </section>
  );
};
