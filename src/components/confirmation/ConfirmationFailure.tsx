import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function ConfirmationFailure() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-xl w-full text-center">
        <Image src="/logo.png" alt="YassAuto" className="mx-auto w-36 mb-6" />
        <h1 className="text-3xl font-extrabold text-red-600 mb-2">
          ❌ Paiement non effectué
        </h1>
        <p className="text-zinc-700 mb-6">
          Votre réservation n&apos;a pas pu être finalisée.
        </p>

        <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-200 text-left mb-6">
          <p className="mb-2">
            Le paiement n&apos;a pas pu être traité. Cela peut arriver si :
          </p>
          <ul className="list-disc pl-5 mb-2 text-sm text-zinc-700">
            <li>La carte a été refusée par votre banque</li>
            <li>Vous avez annulé le paiement</li>
            <li>Un problème technique est survenu</li>
          </ul>
          <p className="mb-2">📞 06 48 38 05 68</p>
          <p className="mb-0">
            📧 {process.env.NEXT_PUBLIC_ADMIN_EMAIL || "contact@yassauto.fr"}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/accompagnement")}
            className="px-6 py-3 bg-[#e30613] text-white rounded font-bold"
          >
            Réessayer ma réservation
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-zinc-100 text-zinc-800 rounded"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </div>
  );
}
