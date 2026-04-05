import React from "react";
import { Button } from "@/components/Button";
import { PenTool, Camera, Car, AlertCircle, Wrench, Search } from "lucide-react";
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
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-zinc-200">
      {/* Header compact */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
        <div className="bg-brand-red/10 p-2.5 rounded-xl">
          <PenTool className="w-5 h-5 text-brand-red" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Demande de devis</h2>
          <p className="text-zinc-500 text-xs">Réponse sous 24h</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type de demande - En premier pour UX */}
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
            Type de demande
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ requestType: "repair" })}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.requestType === "repair"
                  ? "border-brand-red bg-red-50 text-brand-red"
                  : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span className="text-sm font-medium">Je sais ce qu'il faut</span>
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ requestType: "diag" })}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.requestType === "diag"
                  ? "border-brand-red bg-red-50 text-brand-red"
                  : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-sm font-medium">Diagnostic panne</span>
            </button>
          </div>
        </div>

        {/* Info Diagnostic */}
        {formData.requestType === "diag" && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm space-y-1">
                <div>
                  <span className="font-semibold text-blue-900">Diagnostic : 50€</span>
                  <span className="text-blue-600"> • </span>
                  <span className="text-green-700 font-medium">30€ étudiant</span>
                  <span className="text-zinc-500 text-xs"> (carte valide)</span>
                </div>
                <p className="text-blue-700 text-xs">💡 Remboursé intégralement si réparation chez nous !</p>
              </div>
            </div>
          </div>
        )}

        {/* Identité - Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Nom
            </label>
            <input
              required
              type="text"
              placeholder="Dupont"
              className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm transition-all"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Prénom
            </label>
            <input
              required
              type="text"
              placeholder="Jean"
              className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm transition-all"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Téléphone
            </label>
            <input
              required
              type="tel"
              placeholder="06 12 34 56 78"
              className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm transition-all"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Email <span className="text-zinc-400 normal-case font-normal">(optionnel)</span>
            </label>
            <input
              type="email"
              placeholder="email@exemple.fr"
              className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm transition-all"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
            />
          </div>
        </div>

        {/* Immatriculation */}
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
            Immatriculation
          </label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              required
              type="text"
              placeholder="AA-123-BB"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm uppercase transition-all"
              value={formData.licensePlate}
              onChange={(e) =>
                updateFormData({
                  licensePlate: e.target.value.toUpperCase(),
                })
              }
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
            {formData.requestType === "repair"
              ? "Réparation souhaitée"
              : "Symptômes observés"}
          </label>
          <textarea
            required
            rows={3}
            placeholder={
              formData.requestType === "repair"
                ? "Ex: Vidange, plaquettes de frein..."
                : "Ex: Bruit au freinage, voyant allumé..."
            }
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm transition-all resize-none"
            value={formData.issueDescription}
            onChange={(e) =>
              updateFormData({ issueDescription: e.target.value })
            }
          ></textarea>
        </div>

        {/* Photos checkbox */}
        <label className="flex items-center gap-2.5 p-3 bg-zinc-50 rounded-lg border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-colors">
          <input
            type="checkbox"
            className="h-4 w-4 text-brand-red focus:ring-brand-red rounded border-zinc-300"
            checked={formData.hasPhotos}
            onChange={(e) =>
              updateFormData({ hasPhotos: e.target.checked })
            }
          />
          <Camera className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-600">
            J'ai des photos/vidéos à envoyer
          </span>
        </label>

        <Button fullWidth type="submit" className="mt-2">
          {formData.requestType === "diag"
            ? "Demander mon RDV Diagnostic"
            : "Envoyer ma demande"}
        </Button>
      </form>
    </div>
  );
};
