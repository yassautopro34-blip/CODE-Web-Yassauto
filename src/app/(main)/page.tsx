"use client";

import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { TrustSection } from "@/components/home/TrustSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ServicesGrid />
      <GoogleReviews />
      <TrustSection />
    </div>
  );
}
