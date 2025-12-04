import Link from "next/link";
import { Facebook, Instagram, Video } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";


export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white py-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <BrandLogo />
            <p className="mt-6 text-zinc-400 text-sm max-w-sm">
              Expertise et accompagnement automobile à Montpellier. Nous vous aidons à acheter votre véhicule en toute confiance.
              <br /><br />
              Partenaire mécanique : <strong className="text-white">Legna Auto</strong>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-brand-red">Services</h3>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/accompagnement" className="hover:text-white transition-colors">Accompagnement Achat</Link></li>
              <li><Link href="/mecanique" className="hover:text-white transition-colors">Devis Mécanique</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-brand-red">Contact</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>Montpellier & Alentours</li>
              <li><a href="tel:0648380568" className="hover:text-white transition-colors">06 48 38 05 68</a></li>
              <li><a href="mailto:yassauto.pro34@gmail.com" className="hover:text-white transition-colors">yassauto.pro34@gmail.com</a></li>

              <li className="flex space-x-4 mt-4 pt-2">
                <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
                <SocialLink href="https://www.tiktok.com/@yass.auto.pro" icon={<Video className="w-5 h-5" />} />
                <SocialLink href="https://www.facebook.com/share/17kdB2B3po" icon={<Facebook className="w-5 h-5" />} />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
          <p>&copy; {currentYear} YassAuto. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white hover:bg-brand-red hover:text-white transition-all duration-300 transform hover:-translate-y-1"
  >
    {icon}
  </a>
);