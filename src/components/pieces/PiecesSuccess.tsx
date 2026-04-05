import React from "react";
import { Button } from "@/components/Button";
import { CheckCircle, Clock, Phone, Mail, Package } from "lucide-react";

interface PiecesSuccessProps {
  resetForm: () => void;
}

export const PiecesSuccess: React.FC<PiecesSuccessProps> = ({ resetForm }) => {
  return (
    <div className="bg-zinc-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-zinc-200 max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl md:text-3xl font-black mb-3">
          Demande envoyée !
        </h1>
        <p className="text-zinc-600 mb-8">
          Merci pour votre demande de pièce. Nous allons la traiter rapidement.
        </p>

        {/* Prochaines étapes */}
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-left mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <p className="font-semibold text-blue-900">Prochaines étapes</p>
          </div>
          <ol className="space-y-3 text-sm text-blue-800">
            <li className="flex items-start gap-3">
              <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>On recherche la pièce et on vous envoie un <strong>devis sous 24h</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Si ça vous convient, vous payez via notre <strong>lien sécurisé</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>Livraison/retrait sous <strong>48h</strong> !</span>
            </li>
          </ol>
        </div>

        {/* Photo reminder */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-left mb-8">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">Vous avez une photo ?</p>
              <p className="text-amber-700 mt-1">
                Envoyez-la par WhatsApp au <strong>06 48 38 05 68</strong> ou par email pour nous aider à identifier la pièce.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-zinc-100 p-4 rounded-xl text-sm text-zinc-600 mb-8">
          <p className="font-semibold mb-3">Une question ?</p>
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

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={resetForm} className="flex-1">
            Nouvelle demande
          </Button>
          <Button onClick={() => (window.location.href = "/")} className="flex-1">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};
