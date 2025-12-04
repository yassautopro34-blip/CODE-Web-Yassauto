"use client";
import React from "react";
import { useMechanics } from "@/hooks/useMechanics";
import { MechanicsForm } from "@/components/mechanics/MechanicsForm";
import { MechanicsSuccess } from "@/components/mechanics/MechanicsSuccess";

export default function Mecanique() {
  const { formData, submitted, updateFormData, handleSubmit, resetForm } =
    useMechanics();

  if (submitted) {
    return <MechanicsSuccess resetForm={resetForm} />;
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-brand-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            Mécanique Générale
          </h1>
          <p className="text-xl text-zinc-400">
            Service assuré par notre partenaire de confiance{" "}
            <strong>Legna Auto</strong>.
          </p>
        </div>
      </div>

      <MechanicsForm
        formData={formData}
        updateFormData={updateFormData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}