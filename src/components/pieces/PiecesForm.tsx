import React from "react";
import { Button } from "@/components/Button";
import { 
  User, 
  Phone, 
  Mail, 
  Car, 
  Package, 
  Camera, 
  Truck,
  MapPin,
  Sparkles,
  RefreshCw,
  BadgePercent
} from "lucide-react";
import { PiecesRequest } from "@/types";

interface PiecesFormProps {
  formData: PiecesRequest;
  updateFormData: (data: Partial<PiecesRequest>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  errors?: Record<string, boolean>;
}

export const PiecesForm: React.FC<PiecesFormProps> = ({
  formData,
  updateFormData,
  handleSubmit,
  isProcessing,
  errors = {},
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Coordonnées */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
          <div className="bg-brand-red/10 p-2.5 rounded-xl">
            <User className="w-5 h-5 text-brand-red" />
          </div>
          <div>
            <h2 className="font-bold text-lg">1. Vos coordonnées</h2>
            <p className="text-zinc-500 text-xs">Pour vous envoyer le devis</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Nom et Prénom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                required
                type="text"
                placeholder="Jean Dupont"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                value={formData.fullName}
                onChange={(e) => updateFormData({ fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                Téléphone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  required
                  type="tel"
                  placeholder="06 12 34 56 78"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                  value={formData.phone}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  required
                  type="email"
                  placeholder="jean@email.fr"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Véhicule */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
          <div className="bg-blue-100 p-2.5 rounded-xl">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-lg">2. Votre véhicule</h2>
            <p className="text-zinc-500 text-xs">Pour trouver la bonne référence</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Plaque d&apos;immatriculation *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                F
              </div>
              <input
                required
                type="text"
                placeholder="AA-123-BB"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase font-mono text-lg tracking-wider"
                value={formData.licensePlate}
                onChange={(e) => updateFormData({ licensePlate: e.target.value.toUpperCase() })}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1.5">
              💡 Avec la plaque, on trouve la pièce exacte pour votre véhicule
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                Marque et Modèle <span className="text-zinc-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Peugeot 308"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                value={formData.carModel}
                onChange={(e) => updateFormData({ carModel: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                N° de châssis (VIN) <span className="text-zinc-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: VF3XXXX..."
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all uppercase font-mono text-sm"
                value={formData.vin}
                onChange={(e) => updateFormData({ vin: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: La pièce */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
          <div className="bg-amber-100 p-2.5 rounded-xl">
            <Package className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-bold text-lg">3. La pièce recherchée</h2>
            <p className="text-zinc-500 text-xs">Décrivez ce dont vous avez besoin</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Description de la pièce *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ex: Plaquettes de frein avant, rétroviseur droit électrique, filtre à huile..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all resize-none"
              value={formData.partDescription}
              onChange={(e) => updateFormData({ partDescription: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
              Préférence d&apos;achat
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => updateFormData({ preference: "new" })}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.preference === "new"
                    ? "border-brand-red bg-red-50 text-brand-red"
                    : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold">Pièce Neuve</span>
              </button>
              <button
                type="button"
                onClick={() => updateFormData({ preference: "used" })}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.preference === "used"
                    ? "border-brand-red bg-red-50 text-brand-red"
                    : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm font-semibold">Occasion</span>
                <span className="text-xs text-zinc-400">(selon arrivages)</span>
              </button>
              <button
                type="button"
                onClick={() => updateFormData({ preference: "cheapest" })}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.preference === "cheapest"
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
                }`}
              >
                <BadgePercent className="w-5 h-5" />
                <span className="text-sm font-semibold">Le moins cher !</span>
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-colors">
            <input
              type="checkbox"
              className="w-5 h-5 text-brand-red focus:ring-brand-red rounded border-zinc-300"
              checked={formData.hasPhoto}
              onChange={(e) => updateFormData({ hasPhoto: e.target.checked })}
            />
            <Camera className="w-5 h-5 text-zinc-500" />
            <div>
              <span className="font-medium text-zinc-700">J&apos;ai une photo de la pièce</span>
              <p className="text-xs text-zinc-500">On vous demandera de l&apos;envoyer par email/WhatsApp</p>
            </div>
          </label>
        </div>
      </div>

      {/* Section 4: Livraison */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
          <div className="bg-green-100 p-2.5 rounded-xl">
            <Truck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-bold text-lg">4. Retrait ou Livraison</h2>
            <p className="text-zinc-500 text-xs">Comment récupérer votre pièce ?</p>
          </div>
        </div>

        <div className="space-y-3">
          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.deliveryMethod === "pickup"
                ? "border-green-500 bg-green-50"
                : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <input
              type="radio"
              name="delivery"
              checked={formData.deliveryMethod === "pickup"}
              onChange={() => updateFormData({ deliveryMethod: "pickup" })}
              className="w-5 h-5 text-green-600 focus:ring-green-500"
            />
            <MapPin className={`w-5 h-5 ${formData.deliveryMethod === "pickup" ? "text-green-600" : "text-zinc-400"}`} />
            <div className="flex-1">
              <span className={`font-semibold ${formData.deliveryMethod === "pickup" ? "text-green-700" : "text-zinc-700"}`}>
                Retrait au garage
              </span>
              <p className="text-xs text-zinc-500">7 rue André Marie Ampère, Gigean</p>
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              GRATUIT
            </span>
          </label>

          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.deliveryMethod === "delivery-local"
                ? "border-blue-500 bg-blue-50"
                : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <input
              type="radio"
              name="delivery"
              checked={formData.deliveryMethod === "delivery-local"}
              onChange={() => updateFormData({ deliveryMethod: "delivery-local" })}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <Truck className={`w-5 h-5 ${formData.deliveryMethod === "delivery-local" ? "text-blue-600" : "text-zinc-400"}`} />
            <div className="flex-1">
              <span className={`font-semibold ${formData.deliveryMethod === "delivery-local" ? "text-blue-700" : "text-zinc-700"}`}>
                Livraison 48h
              </span>
              <p className="text-xs text-zinc-500">Montpellier / Sète et alentours</p>
              <p className="text-xs text-green-600 font-medium">Gratuit dès 40€ d&apos;achat • Sinon frais détaillés sur devis</p>
            </div>
          </label>

          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.deliveryMethod === "delivery-france"
                ? "border-purple-500 bg-purple-50"
                : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <input
              type="radio"
              name="delivery"
              checked={formData.deliveryMethod === "delivery-france"}
              onChange={() => updateFormData({ deliveryMethod: "delivery-france" })}
              className="w-5 h-5 text-purple-600 focus:ring-purple-500"
            />
            <Truck className={`w-5 h-5 ${formData.deliveryMethod === "delivery-france" ? "text-purple-600" : "text-zinc-400"}`} />
            <div className="flex-1">
              <span className={`font-semibold ${formData.deliveryMethod === "delivery-france" ? "text-purple-700" : "text-zinc-700"}`}>
                Expédition 48h
              </span>
              <p className="text-xs text-zinc-500">Partout en France</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <Button fullWidth type="submit" isLoading={isProcessing} className="h-14 text-lg">
        Demander mon devis gratuit
      </Button>

      <p className="text-center text-xs text-zinc-500">
        Réponse sous 24h • Devis sans engagement • Paiement sécurisé
      </p>
    </form>
  );
};
