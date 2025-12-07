import React from "react";
import { Button } from "@/components/Button";
import { PenTool, Camera, Car, AlertCircle } from "lucide-react";
import { MechanicQuote } from "@/types";

interface MechanicsFormProps {
  formData: MechanicQuote;
  updateFormData: (data: Partial<MechanicQuote>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const MechanicsForm: React.FC<MechanicsFormProps> = ({
  formData,
  updateFormData,
  handleSubmit,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-zinc-200">
        <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-zinc-100">
          <div className="bg-zinc-100 p-3 rounded-lg">
            <PenTool className="w-8 h-8 text-brand-red" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Demandez votre devis</h2>
            <p className="text-zinc-500 text-sm">
              Entretien, réparation ou recherche de panne
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Nom
              </label>
              <input
                required
                type="text"
                placeholder="Votre nom"
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                value={formData.lastName}
                onChange={(e) => updateFormData({ lastName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Prénom
              </label>
              <input
                required
                type="text"
                placeholder="Votre prénom"
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                value={formData.firstName}
                onChange={(e) => updateFormData({ firstName: e.target.value })}
              />
            </div>
          </div>

          {/* Véhicule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Téléphone
              </label>
              <input
                required
                type="tel"
                placeholder="06 12 34 56 78"
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Email (optionnel)
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Immatriculation
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-3.5 h-5 w-5 text-zinc-400" />
                <input
                  required
                  type="text"
                  placeholder="AA-123-BB"
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red uppercase"
                  value={formData.licensePlate}
                  onChange={(e) =>
                    updateFormData({
                      licensePlate: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Type de demande */}
          <div className="pt-4 border-t border-zinc-100">
            <label className="block text-sm font-bold text-zinc-700 mb-4">
              Connaissez-vous l&apos;origine de la panne ?
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                onClick={() => updateFormData({ requestType: "repair" })}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                  formData.requestType === "repair"
                    ? "border-brand-red bg-red-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.requestType === "repair"
                      ? "border-brand-red"
                      : "border-zinc-300"
                  }`}
                >
                  {formData.requestType === "repair" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    formData.requestType === "repair"
                      ? "text-brand-red"
                      : "text-zinc-600"
                  }`}
                >
                  Oui, je connais la réparation à faire
                </span>
              </div>

              <div
                onClick={() => updateFormData({ requestType: "diag" })}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                  formData.requestType === "diag"
                    ? "border-brand-red bg-red-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.requestType === "diag"
                      ? "border-brand-red"
                      : "border-zinc-300"
                  }`}
                >
                  {formData.requestType === "diag" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    formData.requestType === "diag"
                      ? "text-brand-red"
                      : "text-zinc-600"
                  }`}
                >
                  Non, j&apos;ai besoin d&apos;un diagnostic
                </span>
              </div>
            </div>

            {/* Conditionnelle : Info Diagnostic */}
            {formData.requestType === "diag" && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-blue-900">
                      Forfait Diagnostic : 50€
                    </h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Nous fixerons un rendez-vous pour identifier la panne. Si
                      vous acceptez le devis des réparations par la suite,{" "}
                      <strong>les 50€ du diagnostic seront déduits</strong> de
                      votre facture finale.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                {formData.requestType === "repair"
                  ? "Quelle réparation souhaitez-vous ?"
                  : "Décrivez les symptômes (bruit, voyant, comportement...)"}
              </label>
              <textarea
                required
                rows={4}
                placeholder={
                  formData.requestType === "repair"
                    ? "Ex: Vidange, plaquettes de frein, distribution..."
                    : "Ex: La voiture tremble à 110km/h, bruit métallique au freinage..."
                }
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                value={formData.issueDescription}
                onChange={(e) =>
                  updateFormData({ issueDescription: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="photos"
                className="h-5 w-5 text-brand-red focus:ring-brand-red rounded border-gray-300"
                checked={formData.hasPhotos}
                onChange={(e) =>
                  updateFormData({ hasPhotos: e.target.checked })
                }
              />
              <label
                htmlFor="photos"
                className="text-sm text-zinc-700 flex items-center cursor-pointer"
              >
                <Camera className="w-4 h-4 mr-2 text-zinc-500" />
                J&apos;ai des photos/vidéos du problème (à envoyer plus tard)
              </label>
            </div>
          </div>

          <Button fullWidth type="submit">
            {formData.requestType === "diag"
              ? "Demander mon RDV Diagnostic"
              : "Envoyer ma demande de devis"}
          </Button>
        </form>
      </div>
    </div>
  );
};
