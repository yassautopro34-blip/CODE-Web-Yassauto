import React from "react";
import { Button } from "@/components/Button";
import { CheckCircle, Clock, Phone, Mail } from "lucide-react";
import { BookingDetails } from "@/types";

interface ConfirmationStepProps {
  bookingData: BookingDetails;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  bookingData,
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="text-center py-8 animate-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-black mb-2">Demande envoyée !</h2>
      <p className="text-zinc-500 text-sm mb-6">
        Merci <strong className="text-zinc-700">{bookingData.clientName}</strong>
      </p>

      {/* Créneau demandé */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-6 text-left">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Créneau demandé</p>
        <p className="font-bold text-lg">
          {formatDate(bookingData.date)} à {bookingData.timeSlot}
        </p>
      </div>

      {/* Prochaines étapes */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-blue-600" />
          <p className="font-semibold text-blue-900 text-sm">Prochaines étapes</p>
        </div>
        <ol className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <span>Nous vérifions nos disponibilités</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <span>Vous recevez une <strong>confirmation sous 60 min</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <span>Un lien de paiement vous est envoyé pour valider</span>
          </li>
        </ol>
      </div>

      {/* Contact */}
      <div className="bg-zinc-100 p-4 rounded-xl text-sm text-zinc-600 mb-6">
        <p className="font-semibold mb-2">Une question ?</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:0648380568" className="flex items-center justify-center gap-2 hover:text-brand-red transition-colors">
            <Phone className="w-4 h-4" />
            06 48 38 05 68
          </a>
          <a href="mailto:yassauto.pro34@gmail.com" className="flex items-center justify-center gap-2 hover:text-brand-red transition-colors">
            <Mail className="w-4 h-4" />
            yassauto.pro34@gmail.com
          </a>
        </div>
      </div>

      <Button variant="secondary" onClick={() => (window.location.href = "/")}>
        Retour à l&apos;accueil
      </Button>
    </div>
  );
};
