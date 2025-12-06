import React from "react";
import { useRouter } from "next/navigation";
import { StripeSession } from "@/app/(main)/confirmation/types";
import { BookingDetails } from "@/types";
import Image from "next/image";

interface ConfirmationSuccessProps {
  session?: StripeSession;
  reservation?: BookingDetails;
}
import Logo from "../../../public/logo.png";
export function ConfirmationSuccess({
  session,
  reservation,
}: ConfirmationSuccessProps) {
  const router = useRouter();

  const email =
    session?.customer_details?.email ||
    reservation?.clientEmail ||
    "Votre email";
  const isStudent = reservation?.isStudent;

  const totalCents = reservation?.amount_cents;

  const bookingDate = reservation?.bookingDate || reservation?.date;

  const bookingTime = reservation?.timeSlot;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-xl w-full text-center">
        <Image src={Logo} alt="YassAuto" className="mx-auto w-36 mb-6" />
        <h1 className="text-3xl font-extrabold text-emerald-600 mb-2">
          ✅ Réservation confirmée !
        </h1>
        <p className="text-zinc-700 mb-6">Merci pour votre confiance.</p>

        <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-200 text-left mb-6">
          <p className="mb-2">
            📧 Email de confirmation : <strong>{email}</strong>
          </p>
          {bookingDate && (
            <p className="mb-1">
              📅 Date : <strong>{bookingDate}</strong>
            </p>
          )}
          {bookingTime && (
            <p className="mb-2">
              🕐 Heure : <strong>{bookingTime}</strong>
            </p>
          )}
          <p className="mb-1">
            💶 Prix total :{" "}
            <strong>150 €{isStudent ? " (tarif étudiant -30%)" : ""}</strong>
          </p>
          <p className="mb-1">
            💳 Acompte payé : <strong>{(totalCents ?? 100) / 100} € TTC</strong>
          </p>
          <p className="mb-0">
            💳 Solde à régler sur place :{" "}
            <strong>{isStudent ? 150 * 0.7 - 20 : 130} € TTC</strong>
          </p>
        </div>

        <p className="text-sm text-zinc-500 mb-6">
          Si vous ne recevez pas l&apos;email sous 5 minutes, vérifiez vos spams
          ou contactez-nous au <strong>06 48 38 05 68</strong>.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-[#e30613] text-white rounded font-bold"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </div>
  );
}
