import React from "react";
import { Button } from "@/components/Button";
import { CheckCircle } from "lucide-react";

interface MechanicsSuccessProps {
  resetForm: () => void;
}

export const MechanicsSuccess: React.FC<MechanicsSuccessProps> = ({
  resetForm,
}) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-3xl font-black mb-4">Demande Envoyée !</h2>
      <p className="text-zinc-600 max-w-md mb-8">
        Votre demande a bien été transmise à notre partenaire{" "}
        <strong>Legna Auto</strong>. Vous serez recontacté dans la journée pour
        confirmer le rendez-vous.
      </p>
      <Button onClick={resetForm} variant="outline">
        Nouvelle demande
      </Button>
    </div>
  );
};
