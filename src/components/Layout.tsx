"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  CarFront,
  Phone,
  PenTool,
  Home,
  Info,
  Facebook,
  Instagram,
  Video,
} from "lucide-react";
import Image from "next/image";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStudentBanner, setShowStudentBanner] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) =>
    pathname === path
      ? "text-brand-red font-bold"
      : "text-zinc-300 hover:text-white";

  useEffect(() => {
    try {
      const hidden = localStorage.getItem("studentBannerHidden");
      setShowStudentBanner(!hidden);
    } catch (e) {
      setShowStudentBanner(true);
    }
  }, []);

  // Composant Logo personnalisé avec image locale
  const BrandLogo = () => (
    <div className="flex items-center gap-1 group">
      <Image
        width={20}
        height={20}
        src="/logo.png"
        alt="YassAuto Logo"
        className="w-20 h-20 object-contain"
      />
      <div className="flex flex-col justify-center -space-y-1">
        <span className="text-xl font-black text-white tracking-tighter italic leading-none">
          YASS<span className="text-brand-red">AUTO</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-zinc-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              href="/public"
              className="flex items-center"
              onClick={closeMenu}
            >
              <BrandLogo />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link
                href="/public"
                className={`text-sm uppercase tracking-wider transition-colors ${isActive("/")}`}
              >
                Accueil
              </Link>
              <Link
                href="/accompagnement"
                className={`text-sm uppercase tracking-wider transition-colors ${isActive("/accompagnement")}`}
              >
                Accompagnement
              </Link>
              <Link
                href="/mecanique"
                className={`text-sm uppercase tracking-wider transition-colors ${isActive("/mecanique")}`}
              >
                Mécanique
              </Link>
              <Link
                href="/propos"
                className={`text-sm uppercase tracking-wider transition-colors ${isActive("/propos")}`}
              >
                À Propos
              </Link>
              <Link
                href="/contact"
                className="bg-white text-brand-black hover:bg-zinc-200 px-4 py-2 rounded-md font-bold text-sm uppercase transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-black border-b border-zinc-800 absolute w-full shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/public"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-white hover:bg-zinc-800 block px-3 py-4 rounded-md text-base font-medium"
              >
                <Home className="h-5 w-5 text-brand-red" />
                <span>Accueil</span>
              </Link>
              <Link
                href="/accompagnement"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-white hover:bg-zinc-800 block px-3 py-4 rounded-md text-base font-medium"
              >
                <CarFront className="h-5 w-5 text-brand-red" />
                <span>Accompagnement</span>
              </Link>
              <Link
                href="/mecanique"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-white hover:bg-zinc-800 block px-3 py-4 rounded-md text-base font-medium"
              >
                <PenTool className="h-5 w-5 text-brand-red" />
                <span>Mécanique</span>
              </Link>
              <Link
                href="/propos"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-white hover:bg-zinc-800 block px-3 py-4 rounded-md text-base font-medium"
              >
                <Info className="h-5 w-5 text-brand-red" />
                <span>À Propos</span>
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="flex items-center space-x-3 text-white hover:bg-zinc-800 block px-3 py-4 rounded-md text-base font-medium"
              >
                <Phone className="h-5 w-5 text-brand-red" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Student Offer Banner (fixed under header) */}
      {showStudentBanner && (
        <div className="fixed left-0 right-0 top-20 z-40 flex justify-center">
          <div
            className="w-full max-w-7xl mx-4 rounded-b-md shadow-lg flex items-center justify-between gap-4 px-4 py-3"
            style={{ background: "#FFA500" }}
            role="region"
            aria-label="Offre étudiante YassAuto"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🎓</span>
              <div className="text-sm md:text-base font-bold text-black">
                <span>
                  Étudiant(e) ? Profite de -30% sur l'accompagnement achat (100€
                  au lieu de 150€)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/accompagnement")}
                className="text-sm font-bold bg-black text-white px-3 py-2 rounded-md hover:opacity-90 transition animate-pulse hover:animate-none"
              >
                → Réserver maintenant
              </button>

              <button
                onClick={() => {
                  setShowStudentBanner(false);
                  try {
                    localStorage.setItem("studentBannerHidden", "1");
                  } catch (e) {}
                }}
                aria-label="Fermer le bandeau offre étudiante"
                className="text-black text-xl font-bold opacity-90 hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow pt-20">{children}</main>

      {/* Footer */}
      <footer className="bg-brand-black text-white py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <BrandLogo />
              <p className="mt-6 text-zinc-400 text-sm max-w-sm">
                Expertise et accompagnement automobile à Montpellier. Nous vous
                aidons à acheter votre véhicule en toute confiance.
                <br />
                <br />
                Partenaire mécanique : <strong>Legna Auto</strong>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-brand-red">
                Services
              </h3>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <Link href="/accompagnement" className="hover:text-white">
                    Accompagnement Achat
                  </Link>
                </li>
                <li>
                  <Link href="/mecanique" className="hover:text-white">
                    Devis Mécanique
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-brand-red">Contact</h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>Montpellier & Alentours</li>
                <li>06 48 38 05 68</li>
                <li>yassauto.pro34@gmail.com</li>
                <li className="flex space-x-4 mt-4">
                  {/* Social Icons */}
                  <a
                    href="#"
                    className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white hover:bg-brand-red hover:text-white transition-all duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@yass.auto.pro?_r=1&_t=ZN-91rLyuryMFP"
                    className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white hover:bg-brand-red hover:text-white transition-all duration-300"
                  >
                    <Video className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.facebook.com/share/17kdB2B3po/?mibextid=wwXIfr"
                    className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white hover:bg-brand-red hover:text-white transition-all duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} YassAuto. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
