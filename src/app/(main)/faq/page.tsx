"use client";

import React, { useState } from "react";
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
    title: "Reprog moteur",
    icon: <Cpu className="w-5 h-5 text-red-500" />,
    color: "bg-red-50",
    items: [
      {
        question: "Quels types de reprog faites-vous ?",
        answer: (
          <div className="space-y-2">
            <p>
              Nous realisons differents niveaux de preparation selon votre objectif : Stage 1, Stage 2,
              Stage 3, conversion E85, Pop and Bang, Launch Control et Multimap.
            </p>
            <p>
              Chaque projet est ajuste au vehicule, a l etat mecanique et a votre usage (daily, route,
              ou usage prive/circuit).
            </p>
          </div>
        ),
      },
      {
        question: "Mon vehicule nest pas liste, cest possible quand meme ?",
        answer: (
          <div className="space-y-2">
            <p>
              Oui, completement. Le catalogue affiche les demandes les plus frequentes, mais il nest pas
              exhaustif.
            </p>
            <p>
              Envoyez-nous la marque, le modele, l annee et la motorisation : nous verifions la
              compatibilite, les gains realistes et les options disponibles.
            </p>
          </div>
        ),
      },
      {
        question: "FAP off, AdBlue off, EGR off : homologe route ou pas ?",
        answer: (
          <div className="space-y-3">
            <p>
              Point legal important : certaines modifications anti-pollution peuvent rendre le vehicule non conforme
              pour un usage sur route ouverte et poser probleme au controle technique.
            </p>
            <p className="text-amber-800 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
              En clair : ce nest pas toujours homologue route.
            </p>
            <p>
              Nous vous expliquons toujours les implications avant intervention et nous proposons des solutions adaptees
              a votre usage reel.
            </p>
          </div>
        ),
      },
      {
        question: "Si jai un souci FAP ou AdBlue, vous avez dautres solutions ?",
        answer: (
          <div className="space-y-3">
            <p>Oui. On commence toujours par un diagnostic, puis on propose la meilleure option :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>correction de gestion et cycles de regeneration</li>
              <li>controle capteurs, pompe et injection AdBlue</li>
              <li>remise en etat ciblee pour retrouver fiabilite et performance</li>
              <li>orientation route ou usage prive/circuit selon votre besoin</li>
            </ul>
            <p>
              L objectif est clair : solution durable, budget maitrise, et aucune surprise apres intervention.
            </p>
          </div>
        ),
      },
      {
        question: "Comment choisir la bonne configuration ?",
        answer: (
          <div className="space-y-2">
            <p>
              Nous faisons un echange technique avant intervention pour valider une configuration coherente
              avec votre budget, votre usage et l etat du vehicule.
            </p>
            <p>
              Vous savez exactement ce qui est fait, pourquoi c est fait, et ce que vous pouvez attendre en resultat.
            </p>
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
        question: "En quoi consiste laccompagnement achat ?",
        answer: (
          <div className="space-y-2">
            <p>
              Nous vous accompagnons sur place pour verifier le vehicule avant achat et eviter les mauvaises surprises.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>inspection mecanique et electronique</li>
              <li>controle de l historique et des documents</li>
              <li>estimation des frais a prevoir</li>
              <li>avis clair avant de signer</li>
            </ul>
          </div>
        ),
      },
      {
        question: "Comment reserver ?",
        answer: "Vous remplissez le formulaire, nous validons le creneau avec vous, puis vous recevez un lien de paiement securise.",
      },
      {
        question: "Quel est le tarif ?",
        answer: "Tarif standard 150 EUR. Tarif etudiant 100 EUR sur presentation de carte etudiante.",
      },
      {
        question: "Zone de deplacement ?",
        answer:
          "Montpellier et autour de Gigean. Au-dela de 30 km, supplement kilometrique.",
      },
    ],
  },
  {
    id: "pieces",
    title: "Pieces et services",
    icon: <Wrench className="w-5 h-5 text-orange-500" />,
    color: "bg-orange-50",
    items: [
      {
        question: "Vendez-vous des pieces sans montage ?",
        answer: "Oui. Vous pouvez commander uniquement les pieces, en retrait atelier, livraison locale ou expedition.",
      },
      {
        question: "Comment commander ?",
        answer: "Passez au garage, appelez-nous, ou utilisez le formulaire. Nous confirmons la reference, puis nous envoyons un lien de paiement securise.",
      },
      {
        question: "Tarif diagnostic ?",
        answer:
          "Diagnostic classique 50 EUR. Tarif etudiant 30 EUR. Le montant est deduit si les reparations sont faites chez nous.",
      },
    ],
  },
  {
    id: "garage",
    title: "Fonctionnement garage",
    icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
    color: "bg-amber-50",
    items: [
      {
        question: "Faut-il prendre rendez-vous ?",
        answer: "Ce nest pas obligatoire, mais fortement conseille pour eviter l attente et preparer votre intervention dans les meilleures conditions.",
      },
      {
        question: "Intervention toutes marques ?",
        answer: "Oui, nous travaillons sur la plupart des marques et motorisations.",
      },
      {
        question: "Vehicule de pret ?",
        answer: "Oui, selon disponibilite.",
      },
      {
        question: "Paiements acceptes ?",
        answer: "Carte bancaire, especes, paiement en ligne securise, et paiement en 3x/4x avec Oney (selon eligibilite).",
      },
      {
        question: "Garantie des reparations ?",
        answer: "Oui, interventions et pieces sont couvertes par les garanties applicables. Les details vous sont rappeles sur votre facture.",
      },
    ],
  },
  {
    id: "multimedia",
    title: "Multimedia et electronique",
    icon: <Smartphone className="w-5 h-5 text-blue-500" />,
    color: "bg-blue-50",
    items: [
      {
        question: "Installez-vous CarPlay et Android Auto ?",
        answer: "Oui, selon la compatibilite du vehicule. Nous vous confirmons la solution adaptee avant montage.",
      },
      {
        question: "Reparation pannes electroniques ?",
        answer: "Oui, avec diagnostic valise, controle des defauts et intervention ciblee sur la panne electronique.",
      },
      {
        question: "Controle avant achat occasion ?",
        answer: "Oui, bilan mecanique et electronique avant achat pour eviter les mauvaises surprises.",
      },
    ],
  },
  {
    id: "achat",
    title: "Achat et depot-vente",
    icon: <Car className="w-5 h-5 text-green-600" />,
    color: "bg-green-50",
    items: [
      {
        question: "Rachat de vehicules doccasion ?",
        answer: "Oui, avec estimation sur etat reel du vehicule et offre rapide.",
      },
      {
        question: "Vente de vehicules revises ?",
        answer: "Oui, avec selection de vehicules controles, prepares et verifies avant mise en vente.",
      },
      {
        question: "Comment fonctionne le depot-vente ?",
        answer: "Nous gerons exposition, essais, vente et securisation de la transaction.",
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">FAQ Yassauto</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
            Reponses claires sur la reprog, la mecanique, les pieces et l accompagnement.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Ex: reprog, FAP, tarif, rendez-vous..."
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
            <h3 className="text-xl font-bold text-zinc-700 mb-2">Aucun resultat trouve</h3>
            <p className="text-zinc-500">
              Essayez un autre mot-cle ou <a href="/contact" className="text-brand-red hover:underline">contactez-nous</a>
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
          <p className="text-zinc-400 mb-6">Notre equipe est la pour vous orienter vers la meilleure solution.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0648380568"
              className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              06 48 38 05 68
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors border border-white/20"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
