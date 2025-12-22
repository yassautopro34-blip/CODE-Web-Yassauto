import React from "react";
import { StudentBanner } from "@/components/layout/student-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <Header />
      <StudentBanner />
      <main className="flex-grow pt-20">{children}</main>

      <Footer />
    </div>
  );
};
