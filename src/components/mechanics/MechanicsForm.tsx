import React from "react";
import { Button } from "@/components/Button";
import { PenTool, Car } from "lucide-react";
import { MechanicQuote } from "@/types";

interface MechanicsFormProps {
  formData: MechanicQuote;
  updateFormData: (data: Partial<MechanicQuote>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red text-sm transition-all";
const labelClass = "block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5";

export const MechanicsForm: React.FC<MechanicsFormProps> = ({
  formData,
  updateFormData,
  handleSubmit,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-zinc-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
        <div className="bg-brand-red/10 p-2.5 rounded-xl">
          <PenTool className="w-5 h-5 text-brand-red" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Pas le temps d&apos;appeler ? Laissez votre numéro, on vous rappelle.</h2>
          <p className="text-zinc-500 text-xs">Diagnostic 50 € (30 € étudiant), déduit si réparation chez nous</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="website"
          value={formData.website ?? ""}
          onChange={(e) => updateFormData({ website: e.target.value })}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Prénom</label>
            <input
              required
              type="text"
              placeholder="Jean"
              className={inputClass}
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Téléphone</label>
            <input
              required
              type="tel"
              placeholder="06 12 34 56 78"
              className={inputClass}
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Immatriculation</label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              required
              type="text"
              placeholder="AA-123-BB"
              className={`${inputClass} pl-9 uppercase`}
              value={formData.licensePlate}
              onChange={(e) => updateFormData({ licensePlate: e.target.value.toUpperCase() })}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Réparation souhaitée</label>
          <textarea
            required
            rows={3}
            placeholder="Ex : vidange, plaquettes de frein, voyant moteur allumé..."
            className={`${inputClass} resize-none`}
            value={formData.issueDescription}
            onChange={(e) => updateFormData({ issueDescription: e.target.value })}
          ></textarea>
        </div>

        <Button fullWidth type="submit" className="mt-2">
          Être rappelé
        </Button>
        <p className="text-center text-xs text-zinc-500 -mt-1">
          Paiement possible en 3x/4x avec Oney* selon la prestation
        </p>
        <p className="text-center text-[11px] text-zinc-400 -mt-2">*Sous réserve d&apos;éligibilité et d&apos;acceptation Oney.</p>
      </form>
    </div>
  );
};
