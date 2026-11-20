"use client";

import { usePathname } from "next/navigation";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site-info";

export function StickyCallBar() {
  const pathname = usePathname();

  if (pathname === "/boutique" || pathname.startsWith("/boutique/")) return null;

  return (
    <a
      href={`tel:${PHONE_TEL}`}
      className="fixed inset-x-0 bottom-0 z-50 bg-emerald-600 py-4 text-center text-lg font-bold text-white md:hidden"
    >
      Appeler – {PHONE_DISPLAY}
    </a>
  );
}
