import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { connectToMongoDB } from "@/lib/db";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YassAuto - Expert Auto Montpellier",
  description:
    "Accompagnement achat véhicule d'occasion et mécanique générale à Montpellier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  connectToMongoDB().catch((err) => console.log(err));
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
