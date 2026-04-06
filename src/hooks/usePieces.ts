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
    // Efface l'erreur du champ modifié
    const key = Object.keys(data)[0];
    if (key) setErrors((prev) => ({ ...prev, [key]: false, global: false }));
  };

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validation centralisée
    const newErrors: Record<string, boolean> = {};
    if (!formData.fullName) newErrors.fullName = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.licensePlate) newErrors.licensePlate = true;
    if (!formData.partDescription) newErrors.partDescription = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsProcessing(false);
      return;
    }

    try {
      // Log du formData envoyé
      console.log("[PIECES] Données envoyées:", formData);
      const res = await fetch("/api/pieces-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // Log de la réponse backend
      console.log("[PIECES] Réponse backend:", data);
      if (!res.ok) {
        setErrors({ global: true });
        return;
      }
      setSubmitted(true);
    } catch (error) {
      // Affiche l'erreur dans la console pour debug
      console.error("Erreur handleSubmit pieces:", error);
      setErrors({ global: true });
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
    errors,
    submitted,
    isProcessing,
    updateFormData,
    handleSubmit,
    resetForm,
  };
};
