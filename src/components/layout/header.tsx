"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/components/layout/site";
import { BrandLogo } from "@/components/layout/brand-logo";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const getLinkStyles = (path: string, isMobile = false) => {
    const isActive = pathname === path;

    if (isMobile) {
      return `flex items-center space-x-3 px-3 py-4 rounded-md text-base font-medium transition-colors ${
        isActive ? "bg-zinc-800 text-brand-red" : "text-white hover:bg-zinc-800"
      }`;
    }

    return `text-sm uppercase tracking-wider transition-colors hover:text-white ${
      isActive ? "text-brand-red font-bold" : "text-zinc-300"
    }`;
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-zinc-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/public" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <BrandLogo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.isCta
                    ? "bg-white text-brand-black hover:bg-zinc-200 px-4 py-2 rounded-md font-bold text-sm uppercase transition-colors"
                    : getLinkStyles(link.href)
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 focus:outline-none hover:text-brand-red transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-black border-b border-zinc-800 absolute w-full shadow-xl animate-in slide-in-from-top-5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={getLinkStyles(link.href, true)}
                >
                  <Icon className={`h-5 w-5 ${pathname === link.href ? "text-brand-red" : "text-zinc-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};