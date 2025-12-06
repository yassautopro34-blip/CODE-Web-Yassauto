import React from "react";
import { Button } from "@/components/Button";
import { CheckCircle } from "lucide-react";
import { BookingDetails } from "@/types";

interface ConfirmationStepProps {
  bookingData: BookingDetails;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  bookingData,
}) => {
  return (
    <div className="text-center py-12 animate-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-black mb-4">Réservation Confirmée !</h2>
      <p className="text-zinc-600 mb-8 max-w-md mx-auto">
        Merci <strong>{bookingData.clientName}</strong>. Votre rendez-vous est
        bloqué pour le <strong>{bookingData.date}</strong> à{" "}
        <strong>{bookingData.timeSlot}</strong>.
      </p>
      <div className="bg-zinc-50 p-4 rounded-lg max-w-sm mx-auto mb-8 border border-zinc-200">
        <p className="text-sm text-zinc-500">
          Un email de confirmation et votre facture d&apos;acompte ont été envoyés à
          votre adresse (simulée).
        </p>
      </div>
      <Button onClick={() => window.location.reload()}>
        Nouvelle réservation
      </Button>
    </div>
  );
};
