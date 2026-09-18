import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-red">YASSAUTO</p>
        <h1 className="mt-4 text-5xl font-black text-zinc-900">Page introuvable</h1>
        <p className="mt-4 text-zinc-600">
          Cette page n&apos;existe plus ou l&apos;adresse est incorrecte. Revenez à l&apos;accueil pour retrouver nos services.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-brand-red px-6 py-3 font-bold text-white transition hover:bg-red-700"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}