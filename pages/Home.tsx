import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ShieldCheck, Search, Wrench, ChevronRight, Star } from 'lucide-react';

export const Home: React.FC = () => {
  const { primarySrc, fallbackSrc, finalFallback } = useMemo(() => {
    const idx = Math.floor(Math.random() * 5) + 1;
    const base = `/fond acceuil/${idx}`;
    const primary = encodeURI(`${base}.jpg`);
    const fallback = encodeURI(`${base}.png`);
    const jpeg = encodeURI(`${base}.jpeg`);
    const final = '/presentation.gif.gif';
    return { primarySrc: primary, fallbackSrc: fallback, finalFallback: final };
  }, []);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const tried = img.dataset.tried;
    if (!tried) {
      img.dataset.tried = 'tried-jpg';
      img.src = fallbackSrc;
      return;
    }
    if (tried === 'tried-jpg') {
      img.dataset.tried = 'tried-png';
      img.src = primarySrc.replace('.jpg', '.jpeg');
      return;
    }
    img.src = finalFallback;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-brand-black py-20 lg:py-32 overflow-hidden">
        {/* Background Image Overlay (random from public/fond acceuil/1..5) */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={primarySrc} alt="Background mechanic" onError={handleImgError} data-tried={""} className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-brand-red/10 text-brand-red px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-brand-red/20">
                L'expert auto de Montpellier
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                Tu ne t'y connais pas en <span className="text-brand-red">mécanique</span>,
                <br />
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">viens là, je t'explique !</span>
              </h1>
              <p className="text-lg text-zinc-400 mb-8 max-w-lg mx-auto md:mx-0">
                Ne te fais plus arnaquer sur ton achat de voiture d'occasion. Je t'accompagne, j'inspecte, et je sécurise ton achat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/accompagnement">
                  <Button fullWidth className="h-14">Réserver un accompagnement</Button>
                </Link>
                <Link to="/mecanique">
                  <Button variant="outline" fullWidth className="h-14">Demande de devis mécanique</Button>
                </Link>
              </div>
            </div>
            
            {/* Visual Element - Yassine Placeholder */}
            <div className="relative hidden md:block flex items-center justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-800 rotate-2 hover:rotate-0 transition-all duration-500 scale-75">
                <img 
                  src="/presentation.gif.gif" 
                  alt="Yassine YassAuto" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <p className="text-white font-bold">Yassine</p>
                  <p className="text-zinc-400 text-sm">Fondateur & Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-brand-black mb-4">Mes Services</h2>
            <div className="w-20 h-1.5 bg-brand-red mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="bg-brand-red/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
                <Search className="w-7 h-7 text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Diagnostic Complet</h3>
              <p className="text-zinc-600 mb-6">
                Passage à la valise, inspection moteur, châssis, carrosserie. Rien n'est laissé au hasard lors de la visite.
              </p>
              <Link to="/accompagnement" className="text-brand-red font-bold flex items-center hover:underline">
                En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="bg-brand-red/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
                <ShieldCheck className="w-7 h-7 text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sécurisation Achat</h3>
              <p className="text-zinc-600 mb-6">
                Vérification des papiers, de l'historique et des factures. Évitez les vices cachés et les arnaques.
              </p>
              <Link to="/accompagnement" className="text-brand-red font-bold flex items-center hover:underline">
                En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="bg-brand-red/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
                <Wrench className="w-7 h-7 text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mécanique Générale</h3>
              <p className="text-zinc-600 mb-6">
                En partenariat avec <strong>Legna Auto</strong>. Entretien, réparation, devis rapide et transparent.
              </p>
              <Link to="/mecanique" className="text-brand-red font-bold flex items-center hover:underline">
                Demander un devis <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-3xl md:text-4xl font-black mb-6">La confiance avant tout.</h2>
               <p className="text-zinc-400 text-lg mb-6">
                 YassAuto, c'est une histoire de famille et de passion. Nous apportons une transparence totale dans un milieu souvent opaque.
               </p>
               <div className="flex flex-col space-y-4">
                 <div className="flex items-center space-x-3">
                   <div className="bg-green-500/10 p-2 rounded-full"><Star className="w-5 h-5 text-green-500" fill="currentColor" /></div>
                   <span className="font-semibold">Transparence totale sur l'état du véhicule</span>
                 </div>
                 <div className="flex items-center space-x-3">
                   <div className="bg-green-500/10 p-2 rounded-full"><Star className="w-5 h-5 text-green-500" fill="currentColor" /></div>
                   <span className="font-semibold">Devis mécanique sur place inclus</span>
                 </div>
                 <div className="flex items-center space-x-3">
                   <div className="bg-green-500/10 p-2 rounded-full"><Star className="w-5 h-5 text-green-500" fill="currentColor" /></div>
                   <span className="font-semibold">Déplacement inclus sur Montpellier + 30km</span>
                 </div>
               </div>
               <div className="mt-8">
                 <Link to="/propos">
                   <Button variant="secondary">Découvrir notre histoire</Button>
                 </Link>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <img src="https://picsum.photos/400/400?random=1" className="rounded-2xl shadow-lg border border-zinc-800" alt="Inspection engine" />
               <img src="https://picsum.photos/400/400?random=2" className="rounded-2xl shadow-lg border border-zinc-800 mt-8" alt="Happy client" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};