import { useState } from "react";
import { BookingDetails, Step } from "@/types";

export const useAssistance = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.DATE_SELECTION);
  const [bookingData, setBookingData] = useState<BookingDetails>({
    date: "",
    timeSlot: "",
    status: "pending",
    carUrl: "",
    carModel: "",
    city: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    hasDocs: false,
    isStudent: false,
    bookingDate: "",
    bookingType: "",
    description: "",
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

  const simulatePayment = async () => {
    setIsProcessing(true);
    try {
      // Validate email
      if (!bookingData.clientEmail || !bookingData.clientEmail.includes("@")) {
        throw new Error("Veuillez entrer une adresse email valide");
      }

      // Prepare payload expected by backend
      const payload: BookingDetails = {
        carModel: bookingData.carModel,
        carUrl: bookingData.carUrl,
        city: bookingData.city,
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
        description: `Véhicule: ${bookingData.carModel} | Ville: ${bookingData.city} | Annonce: ${bookingData.carUrl} | Docs: ${bookingData.hasDocs ? "Oui" : "Non"}`,
      };

      // Create Stripe Checkout session on backend
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

      // Redirect browser to Stripe Checkout (or mock URL returned by backend)
      if (data && data.url) {
        window.location.href = data.url;
        return; // stop further processing — user is redirected to Stripe
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
    simulatePayment,
  };
};
