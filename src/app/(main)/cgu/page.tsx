import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation - YASSAUTO",
  description: "Conditions générales d'utilisation du site YASSAUTO.",
};

export default function TermsPage() {
  return (
    <article className="bg-zinc-50 min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <header>
          <h1 className="text-3xl font-black text-zinc-900">Conditions générales d’utilisation</h1>
          <p className="mt-2 text-sm text-zinc-500">Dernière mise à jour : 18 septembre 2026</p>
        </header>
        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Objet</h2>
          <p>
            Le site présente les services YASSAUTO et permet d’envoyer des demandes de rendez-vous, devis ou
            pièces. Une demande en ligne ne vaut pas acceptation définitive d’une prestation : elle doit être
            confirmée par YASSAUTO.
          </p>
        </section>
        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Utilisation du site</h2>
          <p>
            L’utilisateur s’engage à fournir des informations exactes, à ne pas détourner les formulaires et à
            ne pas tenter d’accéder aux espaces ou données qui ne lui sont pas destinés.
          </p>
        </section>
        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Responsabilité</h2>
          <p>
            YASSAUTO s’efforce de maintenir des informations à jour, sans garantir l’absence d’interruption ou
            d’erreur. Les conditions et tarifs applicables à une prestation sont confirmés avant intervention.
          </p>
        </section>
        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Contact</h2>
          <p>Pour toute question : yassauto.pro34@gmail.com ou 06 48 38 05 68.</p>
        </section>
      </div>
    </article>
  );
}