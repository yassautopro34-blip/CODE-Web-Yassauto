// components/CookieBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { setConsentAction } from "@/lib/cookie-actions";
import { updateGA4Consent } from "@/lib/gtag";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    // Check if cookie exists using native JS (no library needed)
    const hasConsentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookie_consent="));

    if (!hasConsentCookie) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initializing state from cookie on mount
      setIsVisible(true);
    } else {
      const isGranted = hasConsentCookie.split("=")[1] === "true";
      updateGA4Consent(isGranted);
    }
  }, []);

  const handleAction = async (granted: boolean) => {
    setIsVisible(false);
    document.cookie = `cookie_consent=${granted}; Max-Age=31536000; Path=/; SameSite=Lax`;
    updateGA4Consent(granted);

    try {
      await setConsentAction(granted);
    } catch (error) {
      console.error("Unable to persist cookie consent on the server:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:w-80 bg-white border shadow-lg rounded-lg p-6 z-50">
      <p className="text-sm text-gray-700 mb-2 font-semibold">Votre confidentialité compte</p>
      <p className="text-xs text-gray-600 mb-4">
        Nous utilisons des cookies de mesure d&apos;audience uniquement avec votre accord. {" "}
        <Link href="/politique-confidentialite" className="underline hover:text-black">
          En savoir plus
        </Link>
      </p>

      {isCustomizing && (
        <label className="flex items-start gap-2 mb-4 text-xs text-gray-700">
          <input
            type="checkbox"
            checked={analyticsConsent}
            onChange={(event) => setAnalyticsConsent(event.target.checked)}
            className="mt-0.5"
          />
          <span>Mesure d&apos;audience Google Analytics</span>
        </label>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        {!isCustomizing ? (
          <>
            <button
              onClick={() => void handleAction(false)}
              className="text-xs cursor-pointer hover:text-black text-gray-500 underline"
            >
              Tout refuser
            </button>
            <button
              onClick={() => setIsCustomizing(true)}
              className="text-xs cursor-pointer text-gray-700 underline"
            >
              Personnaliser
            </button>
            <button
              onClick={() => void handleAction(true)}
              className="bg-brand-red hover:brightness-[90%] cursor-pointer text-white px-4 py-2 rounded text-sm"
            >
              Tout accepter
            </button>
          </>
        ) : (
          <button
            onClick={() => void handleAction(analyticsConsent)}
            className="bg-brand-red hover:brightness-[90%] cursor-pointer text-white px-4 py-2 rounded text-sm"
          >
            Enregistrer mes choix
          </button>
        )}
      </div>
    </div>
  );
}
