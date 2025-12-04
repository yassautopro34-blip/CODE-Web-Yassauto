import React from "react";
import { Button } from "@/components/Button";
import { AlertTriangle, CreditCard } from "lucide-react";
import { BookingDetails } from "@/types";

interface PaymentStepProps {
  bookingData: BookingDetails;
  prevStep: () => void;
  simulatePayment: () => void;
  isProcessing: boolean;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  bookingData,
  prevStep,
  simulatePayment,
  isProcessing,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-bold mb-2">3. Paiement de l&apos;acompte</h3>

      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-200">
          <span className="font-semibold text-zinc-600">Prestation</span>
          <span className="font-bold">Accompagnement Achat</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-zinc-600">Total</span>
          <span className="font-bold">
            {bookingData.isStudent ? "100,00 €" : "150,00 €"}
          </span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span className="font-bold text-brand-red">Acompte à régler</span>
          <span className="font-bold text-brand-red">20,00 €</span>
        </div>
        <p className="text-xs text-zinc-500 mt-2 italic">
          Le solde ({bookingData.isStudent ? "80€" : "130€"}) sera à régler sur
          place.
        </p>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-xs text-red-800">
          <strong>Politique d&apos;annulation :</strong> <br />
          &bull; Annulation {">"} 2h avant : Acompte remboursé.
          <br />
          &bull; Annulation {"<"} 2h avant ou absence : Acompte perdu.
          <br />
          &bull; Retard {">"} 20 min : RDV considéré comme annulé.
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" onClick={prevStep} className="flex-1">
          Retour
        </Button>
        <Button
          className="flex-1"
          onClick={() => simulatePayment()}
          isLoading={isProcessing}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Payer 20€ (Stripe)
        </Button>
      </div>
      <p className="text-center text-xs text-zinc-400 mt-2">
        Paiement sécurisé via Stripe
      </p>
    </div>
  );
};
