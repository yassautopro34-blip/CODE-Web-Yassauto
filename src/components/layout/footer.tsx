import Link from "next/link";
import { Facebook, Video } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { SERVICES } from "@/lib/services";
import { PUBLISHED_CITIES } from "@/lib/cities";
import { ADDRESS_LINE, HOURS_SHORT, PHONE_DISPLAY } from "@/lib/site-info";


export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white py-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <BrandLogo />
            <p className="mt-6 text-zinc-400 text-sm max-w-sm">
              Garage mécanique à Gigean, sortie A9, entre Sète et Montpellier.
              <br /><br />
              <strong className="text-white">YASSAUTO MKLF</strong> — SARL au capital de 1 000 €
              <br />
              RCS Montpellier 101 781 854
              <br />
              Assurance professionnelle : AXA Pro
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-brand-red">Nos prestations</h3>
            <ul className="space-y-2 text-zinc-400">
              {SERVICES.map((s) => (
                <li key={s.slug}><Link href={`/${s.slug}`} className="hover:text-white transition-colors">{s.name} à Gigean</Link></li>
              ))}
              <li><Link href="/tarifs" className="hover:text-white transition-colors">Tous nos tarifs</Link></li>
            </ul>
          </div>

          {PUBLISHED_CITIES.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 text-brand-red">Zone d&apos;intervention</h3>
              <ul className="space-y-2 text-zinc-400">
                {PUBLISHED_CITIES.map((c) => (
                  <li key={c.slug}><Link href={`/${c.slug}`} className="hover:text-white transition-colors">Garage {c.name}</Link></li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold mb-4 text-brand-red">Le garage</h3>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/accompagnement" className="hover:text-white transition-colors">Accompagnement Achat</Link></li>
              <li><Link href="/mecanique" className="hover:text-white transition-colors">Devis Mécanique</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Questions Fréquentes</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/cgv" className="hover:text-white transition-colors">CGV boutique</Link></li>
              <li><Link href="/livraison-retours" className="hover:text-white transition-colors">Livraison et retours</Link></li>
              <li><Link href="/cgu" className="hover:text-white transition-colors">CGU</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-brand-red">Contact</h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>{ADDRESS_LINE}</li>
              <li>Lundi-vendredi, {HOURS_SHORT}</li>
              <li><a href="tel:0648380568" className="hover:text-white transition-colors">{PHONE_DISPLAY}</a></li>
              <li><a href="mailto:yassauto.pro34@gmail.com" className="hover:text-white transition-colors">yassauto.pro34@gmail.com</a></li>

              <li className="flex space-x-4 mt-4 pt-2">
                <SocialLink label="TikTok YASSAUTO" href="https://www.tiktok.com/@yass.auto.pro" icon={<Video className="w-5 h-5" aria-hidden="true" />} />
                <SocialLink label="Facebook YASSAUTO" href="https://www.facebook.com/share/17kdB2B3po/?mibextid=wwXIfr" icon={<Facebook className="w-5 h-5" aria-hidden="true" />} />
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

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white hover:bg-brand-red hover:text-white transition-all duration-300 transform hover:-translate-y-1"
  >
    {icon}
  </a>
);