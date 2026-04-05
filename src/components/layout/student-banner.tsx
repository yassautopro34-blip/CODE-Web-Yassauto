"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, X } from "lucide-react";

export const StudentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage only on client mount to avoid Hydration Mismatch
    if (typeof window === 'undefined') return ;
    const isHidden = localStorage.getItem("studentBannerHidden");
    if (!isHidden) {
      // eslint-disable-next-line
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("studentBannerHidden", "1");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs">
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3 flex items-center gap-3"
        role="alert"
      >
        <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-bold leading-tight">
            Étudiant ? <span className="text-amber-400">-30%</span>
          </p>
          <button
            onClick={() => router.push("/accompagnement")}
            className="text-[10px] text-zinc-400 hover:text-amber-400 transition-colors"
          >
            100€ au lieu de 150€ →
          </button>
        </div>

        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};