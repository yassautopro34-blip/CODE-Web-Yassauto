"use client";
import React, { useState } from "react";
import { ChevronDown, Wrench, Lightbulb, Smartphone, Car, Search, ShieldCheck } from "lucide-react";

// Types
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

// Accordion Item Component
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
          isOpen ? "max-h-[500px] opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-zinc-600 leading-relaxed px-1 text-[15px]">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

// Section Component
const FAQSectionComponent: React.FC<{
  section: FAQSection;
  openItems: Set<string>;
  toggleItem: (id: string) => void;
}> = ({ section, openItems, toggleItem }) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Section Header */}
      <div className={`px-6 py-4 border-b border-zinc-100 ${section.color}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/80 rounded-xl shadow-sm">
            {section.icon}
          </div>
          <h2 className="text-lg font-bold text-zinc-900">{section.title}</h2>
        </div>
      </div>
      {/* Questions */}
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

// FAQ Data
const faqSections: FAQSection[] = [
  {
    id: "accompagnement",
    title: "Accompagnement Achat Véhicule",
    icon: <ShieldCheck className="w-5 h-5 text-brand-red" />,
    color: "bg-red-50",
    items: [
      {
        question: "En quoi consiste l'accompagnement achat ?",
        answer: (
          <div className="space-y-3">
            <p>
              <strong>Je me déplace avec vous</strong> pour inspecter le véhicule que vous souhaitez acheter. 
              L&apos;objectif : vous éviter les arnaques et les mauvaises surprises !
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Diagnostic complet</strong> : passage à la valise, inspection moteur, châssis, carrosserie</li>
              <li><strong>Vérification des documents</strong> : carte grise, historique d&apos;entretien, factures</li>
              <li><strong>Estimation des réparations</strong> : devis sur place si problèmes détectés</li>
              <li><strong>Conseil achat</strong> : je vous dis honnêtement si c&apos;est une bonne affaire ou non</li>
            </ul>
            <p className="text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100 mt-3">
              💡 Déplacement inclus sur Montpellier et rayon 30 km. Au-delà, supplément kilométrique.
            </p>
          </div>
        ),
      },
      {
        question: "Comment réserver un accompagnement ?",
        answer: (
          <div className="space-y-3">
            <p>Le processus est simple et rapide :</p>
            <ol className="space-y-2">
              <li className="flex gap-2">
                <span className="bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <span>Remplissez le formulaire sur la page <strong>Accompagnement</strong> avec vos infos et le créneau souhaité</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <span>Nous vérifions nos disponibilités et vous recontactons</span>
              </li>
              <li className="flex gap-2">
                <span className="bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <span>Vous recevez un <strong>lien de paiement</strong> pour valider définitivement le RDV</span>
              </li>
            </ol>
            <p className="text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 mt-3">
              ⏰ <strong>Confirmation sous 60 minutes max</strong> pendant nos horaires d&apos;ouverture !
            </p>
          </div>
        ),
      },
      {
        question: "Quel est le tarif de l'accompagnement ?",
        answer: (
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <span>Tarif standard</span>
              <span className="font-bold text-lg">150 €</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Tarif étudiant <span className="text-zinc-400 text-sm">(carte étudiante)</span></span>
              <span className="font-bold text-lg text-green-600">100 € <span className="text-sm font-normal">(-30%)</span></span>
            </div>
            <p className="text-zinc-500 text-sm mt-3">
              Le paiement se fait après confirmation du créneau par lien sécurisé.
            </p>
          </div>
        ),
      },
      {
        question: "Pourquoi je ne peux plus payer directement en ligne ?",
        answer: (
          <div className="space-y-2">
            <p>
              Pour vous offrir un <strong>meilleur service</strong>, nous avons changé notre fonctionnement :
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Nous vérifions d&apos;abord nos disponibilités réelles</li>
              <li>Nous pouvons échanger avec vous si besoin (lieu, horaire...)</li>
              <li>Vous ne payez que quand le RDV est 100% confirmé</li>
            </ul>
            <p className="mt-3">
              Résultat : <strong>moins d&apos;annulations</strong> et un service plus flexible !
            </p>
          </div>
        ),
      },
      {
        question: "Dans quels secteurs vous déplacez-vous ?",
        answer: (
          <div className="space-y-2">
            <p><strong>Déplacement inclus dans le tarif :</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Montpellier et agglomération</li>
              <li>Sète, Frontignan, Mèze</li>
              <li>Lunel, Nîmes</li>
              <li>Tout le rayon 30 km autour de Gigean</li>
            </ul>
            <p className="text-zinc-500 text-sm mt-3">
              Au-delà de 30 km : supplément de 0,50€/km appliqué.
            </p>
          </div>
        ),
      },
      {
        question: "Que se passe-t-il si je dois annuler ?",
        answer: (
          <div className="space-y-2">
            <p><strong>Politique d&apos;annulation :</strong></p>
            <ul className="space-y-1 mt-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Annulation <strong>&gt; 2h avant</strong> : remboursement intégral</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                <span>Annulation <strong>&lt; 2h avant</strong> ou absence : non remboursé</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                <span>Retard <strong>&gt; 20 min</strong> : RDV considéré comme annulé</span>
              </li>
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    id: "pieces",
    title: "Pièces et Services",
    icon: <Wrench className="w-5 h-5 text-orange-500" />,
    color: "bg-orange-50",
    items: [
      {
        question: "Vendez-vous des pièces détachées sans prestation de montage ?",
        answer:
          "Oui, tout à fait ! Si vous souhaitez effectuer les réparations vous-même, vous pouvez nous commander uniquement les pièces. Nous proposons une livraison sous 48h sur le secteur de Montpellier et Sète, ou une expédition sous 48h partout ailleurs en France.",
      },
      {
        question: "Comment se passe la commande de pièces ?",
        answer: (
          <div className="space-y-3">
            <p>Le processus est très simple et s&apos;adapte à vos préférences. Vous pouvez :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Passer directement nous voir au garage à Gigean</li>
              <li>Nous appeler par téléphone</li>
              <li>Remplir le formulaire dédié sur notre site</li>
            </ul>
            <p>
              Une fois votre demande traitée, nous vous envoyons un lien de paiement sécurisé. 
              Dès que le règlement est validé, vous recevez votre facture et votre commande est 
              préparée pour l&apos;expédition ou la livraison !
            </p>
          </div>
        ),
      },
      {
        question: "Quel est le tarif pour un diagnostic auto ?",
        answer: (
          <div className="space-y-2">
            <p>
              <strong>Diagnostic classique :</strong> 50 €
            </p>
            <p>
              <strong>Tarif étudiant :</strong> 30 € (sur présentation de la carte)
            </p>
            <p className="text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100 mt-3">
              💡 Ce montant vous est <strong>intégralement remboursé</strong> si vous faites effectuer 
              les réparations chez nous !
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "garage",
    title: "Fonctionnement du Garage",
    icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
    color: "bg-amber-50",
    items: [
      {
        question: "Faut-il obligatoirement prendre rendez-vous ?",
        answer:
          "Non, mais c'est fortement conseillé pour vous accueillir dans les meilleures conditions et commander les pièces à l'avance. En cas d'urgence, n'hésitez pas à nous appeler ou passer directement.",
      },
      {
        question: "Prenez-vous en charge toutes les marques de véhicules ?",
        answer:
          "Oui, notre équipe est multimarque et formée pour intervenir sur tous types de véhicules, de la citadine à l'utilitaire.",
      },
      {
        question: "Prêtez-vous un véhicule pendant l'immobilisation du mien ?",
        answer: "Oui, nous proposons un véhicule de prêt pour vous dépanner pendant que nous intervenons sur le vôtre.",
      },
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        answer:
          "Nous acceptons les cartes bancaires, les espèces et les paiements sécurisés en ligne via notre lien de facturation.",
      },
      {
        question: "Vos réparations sont-elles garanties ?",
        answer:
          "Oui, toutes nos interventions et les pièces que nous fournissons sont couvertes par la garantie constructeur/légale.",
      },
      {
        question: "Proposez-vous de passer le contrôle technique à ma place ?",
        answer: (
          <div className="space-y-2">
            <p>
              Oui, absolument ! Nous prenons en charge votre véhicule et l&apos;emmenons passer son 
              contrôle technique dans un centre partenaire.
            </p>
            <p>
              Vous nous déposez simplement votre voiture au garage, et on s&apos;occupe du reste.
              Fini la perte de temps dans les salles d&apos;attente !
            </p>
            <p className="text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 mt-2">
              💡 Si nécessaire, nous pouvons faire un pré-contrôle avant pour éviter toute contre-visite.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "multimedia",
    title: "Multimédia et Électronique",
    icon: <Smartphone className="w-5 h-5 text-blue-500" />,
    color: "bg-blue-50",
    items: [
      {
        question: "Installez-vous des systèmes Apple CarPlay ou Android Auto ?",
        answer: (
          <div className="space-y-2">
            <p>
              Oui ! Nous proposons l&apos;installation d&apos;écrans et de modules CarPlay/Android Auto 
              pour moderniser votre véhicule.
            </p>
            <p>
              Vous pourrez profiter du GPS, de votre musique et de vos applications directement 
              sur le tableau de bord.
            </p>
            <p className="text-zinc-500 text-sm mt-2">
              Contactez-nous avec la marque, le modèle et l&apos;année de votre voiture pour vérifier 
              la compatibilité et recevoir un devis.
            </p>
          </div>
        ),
      },
      {
        question: "Proposez-vous la réparation de pannes électroniques ?",
        answer:
          "Oui, nous sommes équipés des valises de diagnostic pour lire et effacer les codes défauts, et nous intervenons sur les pannes électroniques.",
      },
      {
        question: "Puis-je faire vérifier une voiture d'occasion avant de l'acheter ?",
        answer: (
          <div className="space-y-2">
            <p>
              <strong>C&apos;est même fortement recommandé !</strong>
            </p>
            <p>
              Nous effectuons un bilan complet (mécanique et électronique) d&apos;un véhicule
              d&apos;occasion avant votre achat pour vous éviter les mauvaises surprises.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    id: "achat",
    title: "Achat, Revente et Dépôt-Vente",
    icon: <Car className="w-5 h-5 text-green-600" />,
    color: "bg-green-50",
    items: [
      {
        question: "Rachetez-vous des véhicules d'occasion ?",
        answer:
          "Oui, nous rachetons des véhicules de toutes marques. Nous évaluons l'état de votre voiture et vous proposons une offre de rachat ferme et rapide, sans obligation d'achat chez nous.",
      },
      {
        question: "Vendez-vous des voitures d'occasion révisées et garanties ?",
        answer:
          "Oui, nous proposons régulièrement une sélection de véhicules d'occasion. Chaque voiture est rigoureusement contrôlée et révisée dans notre atelier à Gigean, et vendue avec garantie.",
      },
      {
        question: "Comment fonctionne votre service de dépôt-vente ?",
        answer: (
          <div className="space-y-2">
            <p>
              Vous voulez vendre votre voiture au meilleur prix sans gérer les annonces, 
              appels ou visites d&apos;inconnus ? Confiez-nous la vente !
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Nous exposons votre véhicule sur notre parc</li>
              <li>Nous gérons les essais avec les acheteurs potentiels</li>
              <li>Nous sécurisons entièrement la transaction financière</li>
            </ul>
            <p className="text-green-700 font-medium mt-2">
              Vous gagnez du temps et vous évitez les arnaques !
            </p>
          </div>
        ),
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

  // Filter sections based on search
  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        const questionMatch = item.question.toLowerCase().includes(searchLower);
        const answerMatch =
          typeof item.answer === "string" &&
          item.answer.toLowerCase().includes(searchLower);
        return questionMatch || answerMatch;
      }),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero */}
      <div className="bg-brand-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Questions Fréquentes
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
            Tout ce que vous devez savoir sur nos services. Vous ne trouvez pas 
            votre réponse ? Contactez-nous directement !
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-transparent backdrop-blur-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
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

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {searchQuery && filteredSections.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-zinc-700 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-zinc-500">
              Essayez avec d&apos;autres mots-clés ou{" "}
              <a href="/contact" className="text-brand-red hover:underline">
                contactez-nous directement
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {(searchQuery ? filteredSections : faqSections).map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-36">
                <FAQSectionComponent
                  section={section}
                  openItems={openItems}
                  toggleItem={toggleItem}
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-brand-black to-zinc-800 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Vous avez encore des questions ?
          </h3>
          <p className="text-zinc-400 mb-6">
            Notre équipe est là pour vous aider. N&apos;hésitez pas à nous contacter !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0648380568"
              className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              📞 06 48 38 05 68
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
