import React from "react";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactMap } from "@/components/contact/ContactMap";

export default function Contact() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      <ContactHero />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Card */}
          <ContactInfo />

          {/* Map Placeholder or Secondary Info */}
          <ContactMap />
        </div>
      </div>
    </div>
  );
}
