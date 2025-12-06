import { useState } from "react";
import { MechanicQuote } from "@/types";

export interface ExtendedMechanicQuote extends MechanicQuote {
  email?: string;
}

export const useMechanics = () => {
  const [formData, setFormData] = useState<ExtendedMechanicQuote>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    licensePlate: "",
    requestType: "repair", // default to repair
    issueDescription: "",
    hasPhotos: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const updateFormData = (data: Partial<ExtendedMechanicQuote>) => {
      setFormData(prev => ({...prev, ...data}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate at least phone or email
      if (!formData.phone && !formData.email) {
        throw new Error("Veuillez fournir un téléphone ou un email");
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      // Send devis request to server
      const response = await fetch(`${apiUrl}/devis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: `${formData.firstName} ${formData.lastName}`,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          licensePlate: formData.licensePlate,
          requestType: formData.requestType,
          issueDescription: formData.issueDescription,
          hasPhotos: formData.hasPhotos,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      console.log("Devis request sent successfully:", data);

      // Success
      setTimeout(() => {
        setSubmitted(true);
      }, 1000);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer la demande";
      console.error("Submission error:", errorMsg);
      alert("Erreur: " + errorMsg);
    }
  };
  
  const resetForm = () => {
      setSubmitted(false);
      // Optionally clear form data here if desired
  }

  return {
    formData,
    submitted,
    updateFormData,
    handleSubmit,
    resetForm
  };
};
