// Helper to update GA4 Consent Mode v2
export const updateGA4Consent = (granted: boolean) => {
  const status = granted ? "granted" : "denied";
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("consent", "update", {
      analytics_storage: status,
      ad_storage: status,
      ad_user_data: status,
      ad_personalization: status,
    });
  }
};

// lib/gtag.ts (Add this to your existing file)
import { sendGAEvent } from "@next/third-parties/google";

export const trackButtonClick = (
  buttonName: string,
  category: string = "engagement",
) => {
  sendGAEvent("event", "button_click", {
    event_category: category,
    event_label: buttonName,
  });
};
