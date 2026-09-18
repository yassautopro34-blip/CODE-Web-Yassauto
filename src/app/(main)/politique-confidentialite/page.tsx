import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité - YASSAUTO",
  description: "Politique de confidentialité et protection des données personnelles de YASSAUTO.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="bg-zinc-50 min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <header>
          <h1 className="text-3xl font-black text-zinc-900">Politique de confidentialité</h1>
          <p className="mt-2 text-sm text-zinc-500">Dernière mise à jour : 18 septembre 2026</p>
        </header>

        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Responsable du traitement</h2>
          <p>
            Le responsable du traitement est YASSAUTO MKLF. Pour toute question ou demande relative à vos
            données : yassauto.pro34@gmail.com.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Données collectées et finalités</h2>
          <p>
            Les formulaires peuvent collecter votre nom, téléphone, email, informations du véhicule,
            description de la demande et créneau souhaité. Ces données servent uniquement à répondre aux
            demandes, organiser un rendez-vous, établir un devis et assurer le suivi de la prestation.
          </p>
          <p>
            Les paiements sont traités par Stripe lorsque cette option est utilisée. YASSAUTO ne collecte pas
            les données complètes de carte bancaire.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Durée de conservation</h2>
          <p>
            Les demandes commerciales sont conservées pendant le temps nécessaire à leur traitement, puis
            archivées pendant la durée légale applicable aux obligations comptables, contractuelles et
            probatoires. Les données Analytics sont soumises à votre consentement et aux paramètres de Google.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Vos droits</h2>
          <p>
            Vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou la portabilité de
            vos données, ainsi que vous opposer à certains traitements. Contactez-nous à
            yassauto.pro34@gmail.com. Vous pouvez également saisir la CNIL.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Cookies et mesure d’audience</h2>
          <p>
            Les mesures d’audience Google Analytics sont désactivées par défaut et ne sont activées qu’après
            votre consentement. Votre choix est conservé dans un cookie technique nécessaire au fonctionnement
            de la bannière.
          </p>
        </section>
      </div>
    </article>
  );
}