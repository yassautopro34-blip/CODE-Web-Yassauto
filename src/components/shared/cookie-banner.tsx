// components/CookieBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { setConsentAction } from "@/lib/cookie-actions";
import { updateGA4Consent } from "@/lib/gtag";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if cookie exists using native JS (no library needed)
    const hasConsentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookie_consent="));

    if (!hasConsentCookie) {
      setIsVisible(true);
    } else {
      const isGranted = hasConsentCookie.split("=")[1] === "true";
      updateGA4Consent(isGranted);
    }
  }, []);

  const handleAction = async (granted: boolean) => {
    await setConsentAction(granted); // Server Action
    updateGA4Consent(granted); // GA Update
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:w-80 bg-white border shadow-lg rounded-lg p-6 z-50">
      <p className="text-sm text-gray-700 mb-4">
        We use cookies for analytics and ads.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => handleAction(false)}
          className="text-xs cursor-pointer hover:text-black text-gray-500 underline"
        >
          Decline
        </button>
        <button
          onClick={() => handleAction(true)}
          className="bg-brand-red hover:brightness-[90%] cursor-pointer text-white px-4 py-2 rounded text-sm"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
