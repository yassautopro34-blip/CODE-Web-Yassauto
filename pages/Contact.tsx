import React from 'react';
import { Phone, Mail, MapPin, Instagram, Video, Facebook } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-brand-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-5xl font-black mb-4">Contactez-nous</h1>
            <p className="text-xl text-zinc-400">Une question ? Un doute ? On est là.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-zinc-100">
                <h2 className="text-2xl font-bold text-brand-black mb-8">Nos Coordonnées</h2>
                
                <div className="space-y-6">
                    <div className="flex items-start">
                        <div className="bg-red-100 p-3 rounded-lg mr-4">
                            <Phone className="w-6 h-6 text-brand-red" />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">Téléphone / WhatsApp</p>
                            <a href="tel:0648380568" className="text-lg text-zinc-600 hover:text-brand-red transition">06 48 38 05 68</a>
                            <p className="text-sm text-zinc-400 mt-1">Réponse rapide de 9h à 19h</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-red-100 p-3 rounded-lg mr-4">
                            <Mail className="w-6 h-6 text-brand-red" />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">Email</p>
                            <a href="mailto:contact@yassauto.fr" className="text-lg text-zinc-600 hover:text-brand-red transition">contact@yassauto.fr</a>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-red-100 p-3 rounded-lg mr-4">
                            <MapPin className="w-6 h-6 text-brand-red" />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">Zone d'intervention</p>
                            <p className="text-zinc-600">Montpellier, Sète, Nîmes, Lunel, Mauguio...</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-100">
                    <h3 className="font-bold mb-4">Suivez-nous sur les réseaux</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <a href="#" className="bg-zinc-900 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition">
                            <Instagram className="w-5 h-5 mr-2" /> Instagram
                        </a>
                        <a href="https://www.tiktok.com/@yass.auto.pro?_r=1&_t=ZN-91rLyuryMFP" className="bg-black text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition">
                            <Video className="w-5 h-5 mr-2" /> TikTok
                        </a>
                         <a href="https://www.facebook.com/share/17kdB2B3po/?mibextid=wwXIfr" className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition">
                            <Facebook className="w-5 h-5 mr-2" /> Facebook
                        </a>
                    </div>
                </div>
            </div>

            {/* Map Placeholder or Secondary Info */}
            <div className="bg-zinc-200 rounded-2xl min-h-[400px] flex items-center justify-center relative overflow-hidden">
                <img src="https://picsum.photos/800/600?grayscale" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="relative z-10 bg-white/90 backdrop-blur p-6 rounded-xl text-center">
                    <h3 className="text-xl font-black text-brand-red mb-2">30 Minutes</h3>
                    <p className="text-zinc-800 font-medium">Autour de Montpellier inclus</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};