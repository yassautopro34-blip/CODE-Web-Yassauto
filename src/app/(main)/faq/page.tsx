"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Wrench, Lightbulb, Smartphone, Car, Search, ShieldCheck, Cpu } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: FAQItem[];
}

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border-b border-zinc-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left hover:bg-zinc-50/50 transition-colors px-1 rounded-lg group"
      >
        <span className="font-semibold text-zinc-900 pr-8 group-hover:text-brand-red transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-brand-red" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[700px] opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-zinc-600 leading-relaxed px-1 text-[15px]">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

const FAQSectionComponent: React.FC<{
  section: FAQSection;
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}> = ({ section, openItems, toggleItem }) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className={`px-6 py-4 border-b border-zinc-100 ${section.color}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/80 rounded-xl shadow-sm">{section.icon}</div>
          <h2 className="text-lg font-bold text-zinc-900">{section.title}</h2>
        </div>
      </div>
      <div className="px-6">
        {section.items.map((item, index) => {
          const itemId = `${section.id}-${index}`;
          return (
            <AccordionItem
              key={itemId}
              item={item}
              isOpen={openItems.has(itemId)}
              onToggle={() => toggleItem(itemId)}
            />
          );
        })}
      </div>
    </div>
  );
};

const faqSections: FAQSection[] = [
  {
    id: "reprogrammation",
    title: "Reprogrammation moteur",
    icon: <Cpu className="w-5 h-5 text-red-500" />,
    color: "bg-red-50",
    items: [
      {
        question: "Quelles reprogrammations proposez-vous ?",
        answer: (
          <div className="space-y-2">
            <p>
              Nous proposons la reprogrammation Stage 1, selon le véhicule et sa motorisation.
            </p>
            <p>
              Chaque projet est étudié au cas par cas : état mécanique, usage quotidien et attentes réalistes
              en matière de gains.
            </p>
          </div>
        ),
      },
      {
        question: "Mon véhicule n'est pas listé, c'est possible quand même ?",
        answer: (
          <div className="space-y-2">
            <p>
              Oui, peut-être. Le catalogue affiche les demandes les plus fréquentes, mais il n&apos;est pas
              exhaustif.
            </p>
            <p>
              Envoyez-nous la marque, le modèle, l&apos;année et la motorisation : nous vérifions la
              compatibilité, les gains réalistes et les options disponibles.
            </p>
          </div>
        ),
      },
      {
        question: "Les interventions antipollution sont-elles homologuées route ?",
        answer: (
          <div className="space-y-3">
            <p>
              Point légal important : nous ne désactivons pas les systèmes antipollution (FAP, EGR, AdBlue).
              Toute reprogrammation est étudiée selon le véhicule, son usage et la réglementation applicable.
            </p>
            <p className="text-amber-800 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
              En clair : le diagnostic et la réparation restent prioritaires avant toute intervention.
            </p>
            <p>
              Nous vous expliquons toujours les implications (assurance, conformité, garantie constructeur)
              avant toute intervention.
            </p>
          </div>
        ),
      },
      {
        question: "J'ai un souci de FAP ou d'AdBlue, que proposez-vous ?",
        answer: (
          <div className="space-y-3">
            <p>
              Oui. On commence par un diagnostic (50 €), puis on nettoie ou on répare le FAP, la vanne EGR
              ou le circuit AdBlue. On ne supprime aucun système antipollution : votre voiture reste conforme
              et passe le contrôle technique.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>contrôle des capteurs, de la pompe et de l&apos;injection AdBlue</li>
              <li>aide à la régénération du filtre à particules</li>
              <li>remplacement ciblé des pièces défectueuses</li>
            </ul>
            <p>L&apos;objectif : une solution durable, un budget maîtrisé et aucune surprise après intervention.</p>
          </div>
        ),
      },
      {
        question: "Comment choisir la bonne configuration ?",
        answer: (
          <div className="space-y-2">
            <p>
              Nous échangeons avec vous avant toute intervention pour valider une configuration cohérente avec
              votre budget, votre usage et l&apos;état du véhicule.
            </p>
            <p>Vous savez exactement ce qui est fait, pourquoi, et ce que vous pouvez en attendre.</p>
          </div>
        ),
      },
    ],
  },
  {
    id: "accompagnement",
    title: "Accompagnement achat",
    icon: <ShieldCheck className="w-5 h-5 text-brand-red" />,
    color: "bg-red-50",
    items: [
      {
        question: "En quoi consiste l'accompagnement achat ?",
        answer: (
          <div className="space-y-2">
            <p>
              Nous vous accompagnons sur place pour vérifier le véhicule avant achat et éviter les mauvaises
              surprises.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>inspection mécanique et électronique</li>
              <li>contrôle de l&apos;historique et des documents</li>
              <li>estimation des frais à prévoir</li>
              <li>avis clair avant de signer</li>
            </ul>
          </div>
        ),
      },
      {
        question: "Comment réserver ?",
        answer:
          "Vous remplissez le formulaire, nous validons le créneau avec vous, puis vous recevez un lien de paiement sécurisé.",
      },
      {
        question: "Quel est le tarif ?",
        answer: "Tarif standard 150 €. Tarif étudiant 100 € sur présentation de la carte étudiante.",
      },
      {
        question: "Quelle est la zone de déplacement ?",
        answer: "Montpellier et autour de Gigean. Au-delà de 30 km, un supplément kilométrique s'applique.",
      },
    ],
  },
  {
    id: "pieces",
    title: "Pièces et services",
    icon: <Wrench className="w-5 h-5 text-orange-500" />,
    color: "bg-orange-50",
    items: [
      {
        question: "Vendez-vous des pièces sans montage ?",
        answer:
          "Oui. Vous pouvez commander uniquement les pièces, en retrait à l'atelier, en livraison locale ou en expédition.",
      },
      {
        question: "Comment commander ?",
        answer:
          "Passez au garage, appelez-nous ou utilisez le formulaire. Nous confirmons la référence, puis nous envoyons un lien de paiement sécurisé.",
      },
      {
        question: "Quel est le tarif du diagnostic ?",
        answer:
          "Diagnostic classique 50 €. Tarif étudiant 30 €. Le montant est déduit si les réparations sont faites chez nous.",
      },
    ],
  },
  {
    id: "garage",
    title: "Fonctionnement du garage",
    icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
    color: "bg-amber-50",
    items: [
      {
        question: "Quels sont vos horaires ?",
        answer: "Du lundi au vendredi, de 10h à 21h, au 7 rue André Marie Ampère, 34770 Gigean.",
      },
      {
        question: "Faut-il prendre rendez-vous ?",
        answer:
          "Oui, on travaille sur rendez-vous. Appelez, on vous propose un créneau sous 48h.",
      },
      {
        question: "Intervenez-vous sur toutes les marques ?",
        answer: "Oui, nous travaillons sur la plupart des marques et des motorisations.",
      },
      {
        question: "Proposez-vous un véhicule de prêt ?",
        answer: "Oui, selon disponibilité.",
      },
      {
        question: "Quels paiements acceptez-vous ?",
        answer:
          "Carte bancaire, espèces, paiement en ligne sécurisé et paiement en 3x/4x avec Oney (selon éligibilité).",
      },
      {
        question: "Les réparations sont-elles garanties ?",
        answer:
          "Oui, les interventions et les pièces sont couvertes par les garanties applicables. Les détails vous sont rappelés sur votre facture.",
      },
    ],
  },
  {
    id: "multimedia",
    title: "Multimédia et électronique",
    icon: <Smartphone className="w-5 h-5 text-blue-500" />,
    color: "bg-blue-50",
    items: [
      {
        question: "Installez-vous CarPlay et Android Auto ?",
        answer:
          "Oui, selon la compatibilité du véhicule. Nous vous confirmons la solution adaptée avant le montage.",
      },
      {
        question: "Réparez-vous les pannes électroniques ?",
        answer:
          "Oui, avec diagnostic à la valise, contrôle des défauts et intervention ciblée sur la panne.",
      },
      {
        question: "Contrôlez-vous un véhicule avant achat ?",
        answer: "Oui, bilan mécanique et électronique avant achat pour éviter les mauvaises surprises.",
      },
    ],
  },
  {
    id: "achat",
    title: "Achat et dépôt-vente",
    icon: <Car className="w-5 h-5 text-green-600" />,
    color: "bg-green-50",
    items: [
      {
        question: "Rachetez-vous des véhicules d'occasion ?",
        answer: "Oui, avec une estimation sur l'état réel du véhicule et une offre rapide.",
      },
      {
        question: "Vendez-vous des véhicules révisés ?",
        answer: "Oui, avec une sélection de véhicules contrôlés, préparés et vérifiés avant la mise en vente.",
      },
      {
        question: "Comment fonctionne le dépôt-vente ?",
        answer: "Nous gérons l'exposition, les essais, la vente et la sécurisation de la transaction.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        const questionMatch = item.question.toLowerCase().includes(searchLower);
        const answerMatch = typeof item.answer === "string" && item.answer.toLowerCase().includes(searchLower);
        return questionMatch || answerMatch;
      }),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-brand-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Vos questions, nos réponses</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
            Réponses claires sur la reprogrammation, la mécanique, les pièces et l&apos;accompagnement.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Ex : reprogrammation, FAP, tarif, rendez-vous..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-transparent backdrop-blur-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-zinc-200 sticky top-[80px] z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {faqSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-sm font-medium text-zinc-700 whitespace-nowrap transition-colors"
              >
                {section.icon}
                <span className="hidden sm:inline">{section.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {searchQuery && filteredSections.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">?</div>
            <h3 className="text-xl font-bold text-zinc-700 mb-2">Aucun résultat trouvé</h3>
            <p className="text-zinc-500">
              Essayez un autre mot-clé ou <Link href="/contact" className="text-brand-red hover:underline">contactez-nous</Link>
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {(searchQuery ? filteredSections : faqSections).map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-36">
                <FAQSectionComponent section={section} openItems={openItems} toggleItem={toggleItem} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-brand-black to-zinc-800 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Vous avez encore des questions ?</h3>
          <p className="text-zinc-400 mb-6">Notre équipe est là pour vous orienter vers la meilleure solution.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0648380568"
              className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              06 48 38 05 68
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors border border-white/20"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
