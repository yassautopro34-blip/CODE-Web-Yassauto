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
          {/* Left: Form */}
          <MechanicsForm
            formData={formData}
            updateFormData={updateFormData}
            handleSubmit={handleSubmit}
          />

          {/* Right: Calendly (sticky) */}
          <div className="lg:sticky lg:top-24 order-first lg:order-last">
            <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-red to-red-600 px-4 sm:px-6 py-3 sm:py-4">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  📅 Réserver un créneau
                </h3>
                <p className="text-red-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                  Prenez rendez-vous directement en ligne
                </p>
              </div>
              <iframe
                src="https://calendly.com/yassauto-pro34/30min"
                className="w-full border-0 h-[450px] sm:h-[520px] lg:h-[580px]"
                title="Prendre rendez-vous — Mécanique"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
