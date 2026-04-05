import { useState } from "react";
import { PiecesRequest } from "@/types";

export const usePieces = () => {
  const [formData, setFormData] = useState<PiecesRequest>({
    fullName: "",
    phone: "",
    email: "",
    licensePlate: "",
    carModel: "",
    vin: "",
    partDescription: "",
    preference: "cheapest",
    hasPhoto: false,
    deliveryMethod: "pickup",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateFormData = (data: Partial<PiecesRequest>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validation basique
      if (!formData.fullName || !formData.phone || !formData.email) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }
      if (!formData.licensePlate) {
        throw new Error("La plaque d'immatriculation est obligatoire");
      }
      if (!formData.partDescription) {
        throw new Error("Veuillez décrire la pièce recherchée");
      }

      // Envoyer la demande
      const res = await fetch("/api/pieces-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSubmitted(true);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Une erreur est survenue";
      alert(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      licensePlate: "",
      carModel: "",
      vin: "",
      partDescription: "",
      preference: "cheapest",
      hasPhoto: false,
      deliveryMethod: "pickup",
    });
    setSubmitted(false);
  };

  return {
    formData,
    submitted,
    isProcessing,
    updateFormData,
    handleSubmit,
    resetForm,
  };
};
