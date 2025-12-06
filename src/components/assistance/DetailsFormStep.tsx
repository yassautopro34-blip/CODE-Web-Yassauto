import React from "react";
import { Button } from "@/components/Button";
import { BookingDetails } from "@/types";

interface DetailsFormStepProps {
  bookingData: BookingDetails;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const DetailsFormStep: React.FC<DetailsFormStepProps> = ({
  bookingData,
  handleInputChange,
  handleCheckboxChange,
  nextStep,
  prevStep,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-bold mb-4">2. Informations Véhicule</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="clientName"
          placeholder="Votre Nom complet"
          value={bookingData.clientName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
        <input
          type="tel"
          name="clientPhone"
          placeholder="Votre Téléphone"
          value={bookingData.clientPhone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
      </div>

      <input
        type="email"
        name="clientEmail"
        placeholder="Votre Email (pour la confirmation)"
        value={bookingData.clientEmail}
        onChange={handleInputChange}
        className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
      />

      <input
        type="text"
        name="postLink"
        placeholder="Lien de l'annonce (Leboncoin, LaCentrale...)"
        value={bookingData.postLink}
        onChange={handleInputChange}
        className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="carModel"
          placeholder="Marque & Modèle"
          value={bookingData.carModel}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={bookingData.address}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
      </div>

      {/* Student discount checkbox */}
      <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <input
          type="checkbox"
          id="isStudent"
          name="isStudent"
          checked={bookingData.isStudent}
          onChange={handleCheckboxChange}
          className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
        />
        <label htmlFor="isStudent" className="text-sm text-zinc-800">
          Je suis étudiant(e) et souhaite bénéficier de la réduction de 30%
        </label>
      </div>

      {bookingData.isStudent && (
        <div className="p-3 bg-yellow-100 rounded-md text-sm text-yellow-900 border border-yellow-200">
          ⚠️ Votre statut étudiant sera vérifié le jour du rendez-vous. Merci de
          vous munir de votre carte d&apos;étudiant en cours de validité. En cas
          de non-présentation, le tarif plein sera appliqué.
        </div>
      )}

      <div className="flex items-center space-x-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
        <input
          type="checkbox"
          id="docs"
          name="hasDocs"
          checked={bookingData.hasDocs}
          onChange={handleCheckboxChange}
          className="h-5 w-5 text-brand-red focus:ring-brand-red border-gray-300 rounded"
        />
        <label htmlFor="docs" className="text-sm text-zinc-700">
          Je possède des photos des papiers/carnet (à envoyer après)
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" onClick={prevStep} className="flex-1">
          Retour
        </Button>
        <Button
          className="flex-1"
          onClick={nextStep}
          disabled={
            !bookingData.clientName ||
            !bookingData.clientPhone ||
            !bookingData.address
          }
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
