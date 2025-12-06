import React from "react";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutProfile } from "@/components/about/AboutProfile";
import { AboutContent } from "@/components/about/AboutContent";

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
