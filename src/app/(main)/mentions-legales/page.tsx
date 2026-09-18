import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales - YASSAUTO",
  description: "Mentions légales du site YASSAUTO MKLF.",
};

export default function MentionsLegalesPage() {
  return (
    <article className="bg-zinc-50 min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <header>
          <h1 className="text-3xl font-black text-zinc-900">Mentions légales</h1>
          <p className="mt-2 text-sm text-zinc-500">Dernière mise à jour : 18 septembre 2026</p>
        </header>

        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Éditeur du site</h2>
          <p>
            Le site yassauto.fr est édité par <strong>YASSAUTO MKLF</strong>, SARL au capital de 1 000 €,
            immatriculée au RCS de Montpellier sous le numéro 101 781 854.
          </p>
          <p>Siège social : 7 rue André Marie Ampère, 34770 Gigean, France.</p>
          <p>Email : yassauto.pro34@gmail.com · Téléphone : 06 48 38 05 68</p>
        </section>

        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
            Site : vercel.com.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-7 text-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900">Propriété intellectuelle</h2>
          <p>
            Les textes, éléments graphiques, photographies, logos et composants du site sont protégés par
            les règles applicables de propriété intellectuelle. Toute reproduction non autorisée est interdite.
          </p>
        </section>
      </div>
    </article>
  );
}