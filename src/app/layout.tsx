import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { connectToMongoDB } from "@/lib/db";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import CookieBanner from "@/components/shared/cookie-banner";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YassAuto - Expert Auto Montpellier",
  icons: {
    icon: "/logo.png",
  },
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
      <head>
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
          `}
        </Script>
        <link rel="icon" href="/logo.ico" sizes="any" />
      </head>
      <Analytics />
      <body className={`${inter.variable} antialiased`}>
        {children}
        <CookieBanner />
        <GoogleAnalytics gaId="G-TWCFKM0B7N" />
      </body>
    </html>
  );
}
