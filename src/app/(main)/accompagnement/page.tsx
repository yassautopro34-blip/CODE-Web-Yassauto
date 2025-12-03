"use client";
import React from "react";
import { Step } from "@/types";
import { useAccompagnement } from "@/hooks/useAccompagnement";
import { DateSelectionStep } from "@/components/accompagnement/DateSelectionStep";
import { DetailsFormStep } from "@/components/accompagnement/DetailsFormStep";
import { PaymentStep } from "@/components/accompagnement/PaymentStep";
import { ConfirmationStep } from "@/components/accompagnement/ConfirmationStep";
import { ServiceDetails } from "@/components/accompagnement/ServiceDetails";

const Accompagnement: React.FC = () => {
  const {
    currentStep,
    bookingData,
    isProcessing,
    handleInputChange,
    handleCheckboxChange,
    nextStep,
    prevStep,
    setTimeSlot,
    simulatePayment,
  } = useAccompagnement();

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-brand-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            Accompagnement Achat
          </h1>
          <p className="text-xl text-zinc-400">
            L'expertise YassAuto pour acheter sereinement.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Service Details */}
        <ServiceDetails />

        {/* Right Column: Booking Wizard */}
        <div id="reservation" className="relative">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-100 sticky top-24">
            {currentStep !== Step.CONFIRMATION && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-zinc-400">
                    ÉTAPE {currentStep} / 3
                  </span>
                  <span className="text-sm font-bold text-brand-red">
                    {currentStep === 1
                      ? "Date"
                      : currentStep === 2
                        ? "Infos"
                        : "Paiement"}
                  </span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-red h-full transition-all duration-300 ease-out"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {currentStep === Step.DATE_SELECTION && (
              <DateSelectionStep
                bookingData={bookingData}
                handleInputChange={handleInputChange}
                setTimeSlot={setTimeSlot}
                nextStep={nextStep}
              />
            )}
            {currentStep === Step.DETAILS && (
              <DetailsFormStep
                bookingData={bookingData}
                handleInputChange={handleInputChange}
                handleCheckboxChange={handleCheckboxChange}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {currentStep === Step.PAYMENT && (
              <PaymentStep
                bookingData={bookingData}
                prevStep={prevStep}
                simulatePayment={simulatePayment}
                isProcessing={isProcessing}
              />
            )}
            {currentStep === Step.CONFIRMATION && (
              <ConfirmationStep bookingData={bookingData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Accompagnement;