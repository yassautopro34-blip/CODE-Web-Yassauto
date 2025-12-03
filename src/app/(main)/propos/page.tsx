import React from "react";
import { AboutHero } from "@/components/propos/AboutHero";
import { AboutProfile } from "@/components/propos/AboutProfile";
import { AboutContent } from "@/components/propos/AboutContent";

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <AboutHero />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Colonne Image / Badges */}
          <AboutProfile />

          {/* Colonne Texte */}
          <AboutContent />
        </div>
      </div>
    </div>
  );
}
