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
      {/* Compact Hero */}
      <div className="bg-brand-black text-white py-6 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">
              Mécanique Générale
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Service assuré par <strong className="text-white">YASSAUTO MKLF</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Disponible
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              3x/4x avec Oney*
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form (full width on large screens) */}
          <div className="lg:col-span-2">
            <MechanicsForm
              formData={formData}
              updateFormData={updateFormData}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
