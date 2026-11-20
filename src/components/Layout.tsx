import React from "react";
import { StudentBanner } from "@/components/layout/student-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyCallBar } from "@/components/seo/seo-bits";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 pb-14 md:pb-0">
      <Header />
      <StudentBanner />
      <main className="flex-grow pt-20">{children}</main>

      <Footer />
      <StickyCallBar />
    </div>
  );
};
