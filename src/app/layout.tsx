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
  metadataBase: new URL("https://www.yassauto.fr"),
  title: "Garage YASSAUTO Gigean - Mécanique auto près de Montpellier",
  icons: {
    icon: "/logo.png",
  },
  description:
    "Garage à Gigean près de Montpellier : mécanique générale, entretien, diagnostic moteur et reprogrammation légale.",
};

const autoRepairJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "@id": "https://www.yassauto.fr/#garage",
  name: "YASSAUTO MKLF",
  image: "https://www.yassauto.fr/img1.jpeg",
  url: "https://www.yassauto.fr",
  telephone: "+33648380568",
  email: "yassauto.pro34@gmail.com",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7 rue André Marie Ampère",
    addressLocality: "Gigean",
    postalCode: "34770",
    addressRegion: "Hérault",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.4981,
    longitude: 3.7047,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "22:00",
    },
  ],
  areaServed: ["Gigean", "Sète", "Frontignan", "Balaruc-les-Bains", "Poussan", "Mèze", "Cournonterral", "Montpellier"],
  sameAs: [
    "https://www.tiktok.com/@yass.auto.pro",
    "https://www.facebook.com/share/17kdB2B3po/?mibextid=wwXIfr",
  ],
  makesOffer: [
    "Vidange et entretien",
    "Distribution et pompe à eau",
    "Freinage disques et plaquettes",
    "Diagnostic FAP, EGR et AdBlue",
    "Recharge climatisation",
    "Installation CarPlay et Android Auto",
    "Reprogrammation moteur légale",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  connectToMongoDB().catch((err) => console.log(err));
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(autoRepairJsonLd) }}
        />
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
