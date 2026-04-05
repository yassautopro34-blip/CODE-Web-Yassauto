import React from "react";
import { Button } from "@/components/Button";
import { Clock, CheckCircle, Calendar, MapPin, Car } from "lucide-react";
import { BookingDetails } from "@/types";

interface RequestConfirmStepProps {
  bookingData: BookingDetails;
  prevStep: () => void;
  submitRequest: () => void;
  isProcessing: boolean;
}

export const RequestConfirmStep: React.FC<RequestConfirmStepProps> = ({
  bookingData,
  prevStep,
  submitRequest,
  isProcessing,
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-bold mb-2">3. Confirmer votre demande</h3>

      {/* Récapitulatif */}
      <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 space-y-4">
        <h4 className="font-semibold text-zinc-700 text-sm uppercase tracking-wide">
          Récapitulatif
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-brand-red mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-zinc-500">Date souhaitée</p>
              <p className="font-semibold">{formatDate(bookingData.date)} à {bookingData.timeSlot}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Car className="w-4 h-4 text-brand-red mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-zinc-500">Véhicule</p>
              <p className="font-semibold">{bookingData.carModel || "Non renseigné"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-brand-red mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-zinc-500">Lieu</p>
              <p className="font-semibold">{bookingData.address || "Non renseigné"}</p>
            </div>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-zinc-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-zinc-600">Tarif</span>
            <span className="font-bold text-lg">
              {bookingData.isStudent ? "100 €" : "150 €"}
            </span>
          </div>
          {bookingData.isStudent && (
            <p className="text-xs text-green-600 mt-1">🎓 Tarif étudiant appliqué (-30%)</p>
          )}
        </div>
      </div>

      {/* Info importante */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm">
            Comment ça marche ?
          </p>
          <ul className="text-xs text-blue-800 mt-2 space-y-1">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span> Vous envoyez votre demande
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span> Nous vérifions nos disponibilités
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span> Confirmation + lien de paiement sous 60 min
            </li>
          </ul>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-zinc-100 p-3 rounded-lg text-center">
        <p className="text-xs text-zinc-600">
          Vos coordonnées : <strong>{bookingData.clientName}</strong> • {bookingData.clientPhone}
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" onClick={prevStep} className="flex-1">
          Retour
        </Button>
        <Button
          className="flex-1"
          onClick={submitRequest}
          isLoading={isProcessing}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Envoyer ma demande
        </Button>
      </div>
    </div>
  );
};
