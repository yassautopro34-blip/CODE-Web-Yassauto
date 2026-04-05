import React, { useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import Image from "next/image";
import VideoCard from "@/components/home/video-card";
import { trackButtonClick } from "@/lib/gtag";
import { Wrench, Package } from "lucide-react";

export const HeroSection: React.FC = () => {
  const handleTracking = useCallback((eventName: string) => {
    trackButtonClick(eventName, "conversions");
  }, []);
  return (
    <section className="relative bg-brand-black py-12 md:py-16 lg:py-24 overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-15">
        <Image
          src="/background/5.png"
          alt="Background mechanic"
          width={"1920"}
          height={"1080"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            {/* Badge plus compact */}
            <div className="inline-flex items-center gap-2 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-bold mb-4 md:mb-6">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              L&apos;expert auto de Montpellier
            </div>
            
            {/* Titre optimisé mobile */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4 md:mb-6">
              Tu ne t&apos;y connais pas en{" "}
              <span className="text-brand-red">mécanique</span>,
              <span className="block mt-2 md:mt-3 text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400">
                viens là, je t&apos;explique !
              </span>
            </h1>
            
            {/* Description plus courte */}
            <p className="text-sm md:text-base lg:text-lg text-zinc-400 mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
              Ne te fais plus arnaquer sur ton achat de voiture d&apos;occasion.
              Je t&apos;accompagne, j&apos;inspecte, et je sécurise ton achat.
            </p>
            
            {/* Boutons optimisés */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                href="/mecanique"
                onClick={() => handleTracking("reserve_home_button")}
                className="group"
              >
                <Button fullWidth className="h-12 md:h-14 text-sm md:text-base flex items-center justify-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Prendre rendez-vous
                </Button>
              </Link>
              
              <Link
                href="/pieces"
                onClick={() => handleTracking("pieces_home_button")}
                className="group"
              >
                <button className="w-full h-12 md:h-14 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  <Package className="w-4 h-4" />
                  Pièces auto
                </button>
              </Link>
            </div>

            {/* Quick stats mobile */}
            <div className="flex items-center justify-center md:justify-start gap-4 mt-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span> 5.0 Google
              </span>
              <span>•</span>
              <span>Réponse en 24h</span>
            </div>
          </div>

          {/* Visual Element */}
          <div className="hidden md:block">
            <VideoCard />
          </div>
        </div>
      </div>
    </section>
  );
};
