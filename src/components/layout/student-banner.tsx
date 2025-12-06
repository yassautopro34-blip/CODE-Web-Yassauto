"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <div className="fixed left-0 right-0 top-20 z-40 flex justify-center pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-7xl mx-4 rounded-b-md shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-[#FFA500]"
        role="alert"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <span className="text-2xl" role="img" aria-label="Student hat">🎓</span>
          <p className="text-sm md:text-base font-bold text-black">
            Étudiant(e) ? Profite de -30% sur l&apos;accompagnement achat (100€ au lieu de 150€)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/accompagnement")}
            className="text-sm font-bold bg-black text-white px-3 py-2 rounded-md hover:opacity-90 transition animate-pulse hover:animate-none whitespace-nowrap"
          >
            → Réserver
          </button>

          <button
            onClick={handleClose}
            aria-label="Fermer le bandeau"
            className="text-black text-xl font-bold opacity-70 hover:opacity-100 px-2"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};