import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/Button";
import Image from "next/image";

export const TrustSection: React.FC = () => {
  return (
    <section className="py-20 bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              La confiance avant tout.
            </h2>
            <p className="text-zinc-400 text-lg mb-6">
              YassAuto, c&apos;est une histoire de famille et de passion. Nous
              apportons une transparence totale dans un milieu souvent opaque.
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <Star
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                  />
                </div>
                <span className="font-semibold">
                  Transparence totale sur l&apos;état du véhicule
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <Star
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                  />
                </div>
                <span className="font-semibold">
                  Devis mécanique sur place inclus
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <Star
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                  />
                </div>
                <span className="font-semibold">
                  Déplacement inclus sur Montpellier + 30km
                </span>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/propos">
                <Button variant="secondary">Découvrir notre histoire</Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              width={300}
              height={300}
              src="https://picsum.photos/400/400?random=1"
              className="rounded-2xl shadow-lg border border-zinc-800"
              alt="Inspection engine"
            />
            <Image
              width={300}
              height={300}
              src="https://picsum.photos/400/400?random=2"
              className="rounded-2xl shadow-lg border border-zinc-800 mt-8"
              alt="Happy client"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
