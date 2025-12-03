import React from "react";
import { Button } from "@/components/Button";
import { BookingDetails, TIME_SLOTS } from "@/types";

interface DateSelectionStepProps {
  bookingData: BookingDetails;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setTimeSlot: (slot: string) => void;
  nextStep: () => void;
}

export const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
  bookingData,
  handleInputChange,
  setTimeSlot,
  nextStep,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-bold mb-4">1. Choisissez votre créneau</h3>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Date du rendez-vous
        </label>
        <input
          type="date"
          name="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={bookingData.date}
          onChange={handleInputChange}
          className="block w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
        <p className="text-xs text-zinc-500 mt-2">
          Délai de réservation minimal : 2 heures avant.
        </p>
      </div>

      {bookingData.date && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Horaire (Durée 1h30)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setTimeSlot(slot)}
                className={`py-2 px-4 rounded-lg text-sm font-bold border transition-all ${
                  bookingData.timeSlot === slot
                    ? "bg-brand-red text-white border-brand-red"
                    : "bg-white text-zinc-700 border-zinc-200 hover:border-brand-red"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <Button
          fullWidth
          disabled={!bookingData.date || !bookingData.timeSlot}
          onClick={nextStep}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
