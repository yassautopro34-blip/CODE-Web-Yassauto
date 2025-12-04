import React from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import Image from "next/image";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-brand-black py-20 lg:py-32 overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/background/5.png"
          layout={"fill"}
          alt="Background mechanic"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-brand-red/10 text-brand-red px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-brand-red/20">
              L&apos;expert auto de Montpellier
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Tu ne t&apos;y connais pas en{" "}
              <span className="text-brand-red">mécanique</span>,
              <br />
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
                viens là, je t&apos;explique !
              </span>
            </h1>
            <p className="text-lg text-zinc-400 mb-8 max-w-lg mx-auto md:mx-0">
              Ne te fais plus arnaquer sur ton achat de voiture d&apos;occasion. Je
              t&apos;accompagne, j&apos;inspecte, et je sécurise ton achat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/accompagnement">
                <Button fullWidth className="h-14">
                  Réserver un accompagnement
                </Button>
              </Link>
              <Link href="/mecanique">
                <Button variant="outline" fullWidth className="h-14">
                  Demande de devis mécanique
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Element - Yassine Placeholder */}
          <div className="relative hidden md:block flex items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-800 rotate-2 hover:rotate-0 transition-all duration-500 scale-75">
              <Image
                src="/presentation.gif.gif"
                alt="Yassine YassAuto"
                className="w-full h-auto object-cover"
                width={500}
                height={500}
                unoptimized
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <p className="text-white font-bold">Yassine</p>
                <p className="text-zinc-400 text-sm">Fondateur & Expert</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
