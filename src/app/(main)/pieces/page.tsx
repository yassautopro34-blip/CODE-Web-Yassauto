"use client";
import React from "react";
import { usePieces } from "@/hooks/usePieces";
import { PiecesForm } from "@/components/pieces/PiecesForm";
import { PiecesSuccess } from "@/components/pieces/PiecesSuccess";

export default function PiecesPage() {
  const { formData, errors, submitted, isProcessing, updateFormData, handleSubmit, resetForm } =
    usePieces();

  if (submitted) {
    return <PiecesSuccess resetForm={resetForm} />;
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Hero compact */}
      <div className="bg-brand-black text-white py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
              Livraison 48h
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Commande de Pièces Auto
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Remplissez le formulaire, on vous envoie un devis gratuit sous 24h. 
            Si ça vous convient, paiement en ligne et livraison rapide !
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {errors.global && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            Une erreur est survenue lors de l&apos;envoi. Réessayez ou contactez-nous directement.
          </div>
        )}
        <PiecesForm
          formData={formData}
          updateFormData={updateFormData}
          handleSubmit={handleSubmit}
          isProcessing={isProcessing}
          errors={errors}
        />
      </div>
    </div>
  );
}
