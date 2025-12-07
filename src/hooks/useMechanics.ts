import { useState } from "react";
import { MechanicQuote } from "@/types";

export const useMechanics = () => {
  const [formData, setFormData] = useState<MechanicQuote>({
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

  const updateFormData = (data: Partial<MechanicQuote>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate at least phone or email
      if (!formData.phone && !formData.email) {
        throw new Error("Veuillez fournir un téléphone ou un email");
      }

      // Send devis request to server
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
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
  };

  return {
    formData,
    submitted,
    updateFormData,
    handleSubmit,
    resetForm,
  };
};
