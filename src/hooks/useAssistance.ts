import { useState } from "react";
import { BookingDetails, Step } from "@/types";

export const useAssistance = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.DATE_SELECTION);
  const [bookingData, setBookingData] = useState<BookingDetails>({
    date: "",
    timeSlot: "",
    status: "pending",
    postLink: "",
    carModel: "",
    address: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    hasDocs: false,
    isStudent: false,
    bookingDate: "",
    bookingType: "",
    description: "",
    amount_cents: 0,
    confirmedAt: "",
    currency: "eur",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "hasDocs") {
      setBookingData((prev) => ({ ...prev, hasDocs: checked }));
    } else if (name === "isStudent") {
      setBookingData((prev) => ({ ...prev, isStudent: checked }));
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const setTimeSlot = (slot: string) => {
    setBookingData((prev) => ({ ...prev, timeSlot: slot }));
  };

  // Nouvelle fonction : envoie la demande sans paiement
  const submitRequest = async () => {
    setIsProcessing(true);
    try {
      // Validate required fields
      if (!bookingData.clientEmail || !bookingData.clientEmail.includes("@")) {
        throw new Error("Veuillez entrer une adresse email valide");
      }
      if (!bookingData.clientPhone) {
        throw new Error("Veuillez entrer votre numéro de téléphone");
      }
      if (!bookingData.date || !bookingData.timeSlot) {
        throw new Error("Veuillez sélectionner une date et un créneau");
      }

      // Prepare payload
      const payload = {
        carModel: bookingData.carModel,
        postLink: bookingData.postLink,
        address: bookingData.address,
        status: "pending",
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        hasDocs: bookingData.hasDocs,
        clientName: bookingData.clientName || "Anonyme",
        clientEmail: bookingData.clientEmail,
        clientPhone: bookingData.clientPhone,
        bookingType: "accompagnement",
        isStudent: bookingData.isStudent,
        description: `Véhicule: ${bookingData.carModel} | Ville: ${bookingData.address} | Annonce: ${bookingData.postLink} | Docs: ${bookingData.hasDocs ? "Oui" : "Non"}`,
      };

      // Envoyer la demande au backend
      const res = await fetch(`/api/booking-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi de la demande");
      }

      // Passer à l'étape de confirmation
      setCurrentStep(Step.CONFIRMATION);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer la demande";
      console.error("Request error:", errorMsg);
      alert("Erreur: " + errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Ancienne fonction pour le paiement Stripe (garde pour compatibilité)
  const simulatePayment = async () => {
    setIsProcessing(true);
    try {
      if (!bookingData.clientEmail || !bookingData.clientEmail.includes("@")) {
        throw new Error("Veuillez entrer une adresse email valide");
      }

      const payload: BookingDetails = {
        currency: "eur",
        confirmedAt: "",
        amount_cents: 0,
        carModel: bookingData.carModel,
        postLink: bookingData.postLink,
        address: bookingData.address,
        status: "pending",
        date: bookingData.date,
        hasDocs: bookingData.hasDocs,
        clientName: bookingData.clientName || "Anonyme",
        clientEmail: bookingData.clientEmail,
        clientPhone: bookingData.clientPhone || "00 00 00 00 00",
        bookingDate: bookingData.date,
        timeSlot: bookingData.timeSlot,
        bookingType: "accompagnement",
        isStudent: bookingData.isStudent,
        description: `Véhicule: ${bookingData.carModel} | Ville: ${bookingData.address} | Annonce: ${bookingData.postLink} | Docs: ${bookingData.hasDocs ? "Oui" : "Non"}`,
      };

      const res = await fetch(`/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la création de la session de paiement",
        );
      }

      if (data && data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Aucun URL de session retourné par le serveur");
    } catch (error) {
      setIsProcessing(false);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Impossible de créer la session de paiement";
      console.error("Checkout error:", errorMsg);
      alert("Erreur: " + errorMsg);
    }
  };

  return {
    currentStep,
    bookingData,
    isProcessing,
    handleInputChange,
    handleCheckboxChange,
    nextStep,
    prevStep,
    setTimeSlot,
    submitRequest,
    simulatePayment,
  };
};
