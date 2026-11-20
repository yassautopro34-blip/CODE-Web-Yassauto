import React from "react";
import Link from "next/link";
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

        <section className="mt-12 max-w-3xl space-y-6 text-zinc-700 leading-relaxed">
          <h2 className="text-2xl font-black text-zinc-900">Un garage à Gigean, ouvert du lundi au vendredi</h2>
          <p>
            YASSAUTO MKLF vous accueille au 7 rue André Marie Ampère, 34770 Gigean, du lundi au vendredi de 10h à
            21h. Le plus simple pour un devis ou une question : appelez le 06 48 38 05 68 ou écrivez-nous par
            WhatsApp. On travaille sur rendez-vous : appelez, on vous propose un créneau sous 48h.
          </p>
          <h2 className="text-xl font-bold text-zinc-900">Zone d&apos;intervention</h2>
          <p>
            Nous accueillons les clients de Gigean, Poussan, Mèze, Balaruc-les-Bains, Frontignan, Sète,
            Cournonterral et Montpellier.
          </p>
          <h2 className="text-xl font-bold text-zinc-900">Que pouvons-nous faire pour vous ?</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Entretien et réparation mécanique : <Link href="/mecanique" className="underline">demander un devis</Link></li>
            <li>Reprogrammation moteur Stage 1, diagnostic FAP / EGR / AdBlue : <Link href="/reprogrammation" className="underline">voir la page</Link></li>
            <li>Accompagnement à l&apos;achat d&apos;une voiture d&apos;occasion : <Link href="/accompagnement" className="underline">réserver</Link></li>
            <li>Pièces auto neuves ou d&apos;occasion : <Link href="/pieces" className="underline">faire une demande</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
