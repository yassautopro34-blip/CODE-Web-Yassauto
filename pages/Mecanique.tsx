
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { PenTool, CheckCircle, Camera, Car, AlertCircle, Wrench } from 'lucide-react';
import { MechanicQuote } from '../types';

interface ExtendedMechanicQuote extends MechanicQuote {
  email?: string;
}

export const Mecanique: React.FC = () => {
  const [formData, setFormData] = useState<ExtendedMechanicQuote>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    licensePlate: '',
    requestType: 'repair', // default to repair
    issueDescription: '',
    hasPhotos: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate at least phone or email
      if (!formData.phone && !formData.email) {
        throw new Error('Veuillez fournir un téléphone ou un email');
      }

      // Send devis request to server
      const response = await fetch('http://localhost:4000/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: `${formData.firstName} ${formData.lastName}`,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          licensePlate: formData.licensePlate,
          requestType: formData.requestType,
          issueDescription: formData.issueDescription,
          hasPhotos: formData.hasPhotos
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur serveur');
      }

      console.log('Devis request sent successfully:', data);

      // Success
      setTimeout(() => {
        setSubmitted(true);
      }, 1000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Impossible d\'envoyer la demande';
      console.error('Submission error:', errorMsg);
      alert('Erreur: ' + errorMsg);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-black mb-4">Demande Envoyée !</h2>
        <p className="text-zinc-600 max-w-md mb-8">
          Votre demande a bien été transmise à notre partenaire <strong>Legna Auto</strong>. 
          Vous serez recontacté dans la journée pour confirmer le rendez-vous.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">Nouvelle demande</Button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
       <div className="bg-brand-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-5xl font-black mb-4">Mécanique Générale</h1>
            <p className="text-xl text-zinc-400">Service assuré par notre partenaire de confiance <strong>Legna Auto</strong>.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-zinc-200">
           <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-zinc-100">
              <div className="bg-zinc-100 p-3 rounded-lg">
                <PenTool className="w-8 h-8 text-brand-red" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Demandez votre devis</h2>
                <p className="text-zinc-500 text-sm">Entretien, réparation ou recherche de panne</p>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Nom</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Prénom</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Votre prénom"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
              </div>

              {/* Véhicule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Téléphone</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="06 12 34 56 78"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Email (optionnel)</label>
                  <input 
                    type="email" 
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Immatriculation</label>
                  <div className="relative">
                    <Car className="absolute left-3 top-3.5 h-5 w-5 text-zinc-400" />
                    <input 
                        required
                        type="text" 
                        placeholder="AA-123-BB"
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red uppercase"
                        value={formData.licensePlate}
                        onChange={(e) => setFormData({...formData, licensePlate: e.target.value.toUpperCase()})}
                    />
                  </div>
                </div>
              </div>

              {/* Type de demande */}
              <div className="pt-4 border-t border-zinc-100">
                <label className="block text-sm font-bold text-zinc-700 mb-4">Connaissez-vous l'origine de la panne ?</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div 
                        onClick={() => setFormData({...formData, requestType: 'repair'})}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                            formData.requestType === 'repair' 
                            ? 'border-brand-red bg-red-50' 
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.requestType === 'repair' ? 'border-brand-red' : 'border-zinc-300'
                        }`}>
                            {formData.requestType === 'repair' && <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />}
                        </div>
                        <span className={`font-medium ${formData.requestType === 'repair' ? 'text-brand-red' : 'text-zinc-600'}`}>
                            Oui, je connais la réparation à faire
                        </span>
                    </div>

                    <div 
                        onClick={() => setFormData({...formData, requestType: 'diag'})}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                            formData.requestType === 'diag' 
                            ? 'border-brand-red bg-red-50' 
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.requestType === 'diag' ? 'border-brand-red' : 'border-zinc-300'
                        }`}>
                             {formData.requestType === 'diag' && <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />}
                        </div>
                        <span className={`font-medium ${formData.requestType === 'diag' ? 'text-brand-red' : 'text-zinc-600'}`}>
                            Non, j'ai besoin d'un diagnostic
                        </span>
                    </div>
                </div>

                {/* Conditionnelle : Info Diagnostic */}
                {formData.requestType === 'diag' && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-bold text-blue-900">Forfait Diagnostic : 50€</h4>
                                <p className="text-sm text-blue-800 mt-1">
                                    Nous fixerons un rendez-vous pour identifier la panne. 
                                    Si vous acceptez le devis des réparations par la suite, <strong>les 50€ du diagnostic seront déduits</strong> de votre facture finale.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-2">
                        {formData.requestType === 'repair' 
                            ? "Quelle réparation souhaitez-vous ?" 
                            : "Décrivez les symptômes (bruit, voyant, comportement...)"}
                    </label>
                    <textarea 
                    required
                    rows={4}
                    placeholder={formData.requestType === 'repair' ? "Ex: Vidange, plaquettes de frein, distribution..." : "Ex: La voiture tremble à 110km/h, bruit métallique au freinage..."}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
                    value={formData.issueDescription}
                    onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
                    ></textarea>
                </div>
              </div>

              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                 <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      id="photos"
                      className="h-5 w-5 text-brand-red focus:ring-brand-red rounded border-gray-300"
                      checked={formData.hasPhotos}
                      onChange={(e) => setFormData({...formData, hasPhotos: e.target.checked})}
                    />
                    <label htmlFor="photos" className="text-sm text-zinc-700 flex items-center cursor-pointer">
                      <Camera className="w-4 h-4 mr-2 text-zinc-500" />
                      J'ai des photos/vidéos du problème (à envoyer plus tard)
                    </label>
                 </div>
              </div>

              <Button fullWidth type="submit">
                {formData.requestType === 'diag' ? 'Demander mon RDV Diagnostic' : 'Envoyer ma demande de devis'}
              </Button>
           </form>
        </div>
      </div>
    </div>
  );
};