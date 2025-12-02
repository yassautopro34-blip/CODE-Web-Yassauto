import React, { useState } from 'react';
import { Button } from '../components/Button';
import { TIME_SLOTS, SERVICE_ZONES, Step, BookingDetails } from '../types';
import { CheckCircle, Clock, MapPin, AlertTriangle, Calendar, CreditCard, Laptop, Wrench, Car, FileCheck, FileText, ClipboardList } from 'lucide-react';

interface ExtendedBookingDetails extends BookingDetails {
  clientEmail?: string;
  isStudent?: boolean;
}

// If you want form submissions to also be saved in a Google Sheet,
// create a Google Apps Script Web App (see instructions provided) and
// paste the deploy URL below. Leave empty to skip sending to the sheet.
const SHEET_WEBHOOK_URL = '';

export const Accompagnement: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.DATE_SELECTION);
  const [bookingData, setBookingData] = useState<ExtendedBookingDetails>({
    date: '',
    timeSlot: '',
    carUrl: '',
    carModel: '',
    city: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    hasDocs: false
    , isStudent: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'hasDocs') {
      setBookingData(prev => ({ ...prev, hasDocs: checked }));
    } else if (name === 'isStudent') {
      setBookingData(prev => ({ ...prev, isStudent: checked }));
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const simulatePayment = async () => {
    setIsProcessing(true);
    try {
      // Validate email
      if (!bookingData.clientEmail || !bookingData.clientEmail.includes('@')) {
        throw new Error('Veuillez entrer une adresse email valide');
      }

      // Prepare payload expected by backend
      const payload = {
        clientName: bookingData.clientName || 'Anonyme',
        clientEmail: bookingData.clientEmail,
        clientPhone: bookingData.clientPhone || '00 00 00 00 00',
        bookingDate: bookingData.date,
        bookingTime: bookingData.timeSlot,
        bookingType: 'accompagnement',
        isStudent: !!bookingData.isStudent,
        description: `Véhicule: ${bookingData.carModel} | Ville: ${bookingData.city} | Annonce: ${bookingData.carUrl} | Docs: ${bookingData.hasDocs ? 'Oui' : 'Non'}`
      };

      // Create Stripe Checkout session on backend
      const res = await fetch('http://localhost:4000/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement');
      }

      // Redirect browser to Stripe Checkout (or mock URL returned by backend)
      if (data && data.url) {
        window.location.href = data.url;
        return; // stop further processing — user is redirected to Stripe
      }

      throw new Error('Aucun URL de session retourné par le serveur');
    } catch (error) {
      setIsProcessing(false);
      const errorMsg = error instanceof Error ? error.message : 'Impossible de créer la session de paiement';
      console.error('Checkout error:', errorMsg);
      alert('Erreur: ' + errorMsg);
    }
  };

  // UI for Step 1: Date & Time
  const renderDateSelection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-bold mb-4">1. Choisissez votre créneau</h3>
      
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Date du rendez-vous</label>
        <input 
          type="date" 
          name="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={bookingData.date} 
          onChange={handleInputChange} 
          className="block w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
        <p className="text-xs text-zinc-500 mt-2">Délai de réservation minimal : 2 heures avant.</p>
      </div>

      {bookingData.date && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">Horaire (Durée 1h30)</label>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => setBookingData(prev => ({ ...prev, timeSlot: slot }))}
                className={`py-2 px-4 rounded-lg text-sm font-bold border transition-all ${
                  bookingData.timeSlot === slot 
                  ? 'bg-brand-red text-white border-brand-red' 
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-brand-red'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <Button 
          fullWidth 
          disabled={!bookingData.date || !bookingData.timeSlot}
          onClick={nextStep}
        >
          Suivant
        </Button>
      </div>
    </div>
  );

  // UI for Step 2: Info
  const renderDetailsForm = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-bold mb-4">2. Informations Véhicule</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" name="clientName" placeholder="Votre Nom complet"
          value={bookingData.clientName} onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
        <input 
          type="tel" name="clientPhone" placeholder="Votre Téléphone"
          value={bookingData.clientPhone} onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
      </div>

      <input 
        type="email" name="clientEmail" placeholder="Votre Email (pour la confirmation)"
        value={bookingData.clientEmail} onChange={handleInputChange}
        className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
      />

      <input 
        type="text" name="carUrl" placeholder="Lien de l'annonce (Leboncoin, LaCentrale...)"
        value={bookingData.carUrl} onChange={handleInputChange}
        className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" name="carModel" placeholder="Marque & Modèle"
          value={bookingData.carModel} onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
        <input 
          type="text" name="city" placeholder="Ville du véhicule"
          value={bookingData.city} onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-brand-red focus:border-brand-red"
        />
      </div>

      {/* Student discount checkbox */}
      <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <input 
          type="checkbox" 
          id="isStudent"
          name="isStudent" 
          checked={!!bookingData.isStudent} 
          onChange={handleCheckboxChange} 
          className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
        />
        <label htmlFor="isStudent" className="text-sm text-zinc-800">Je suis étudiant(e) et souhaite bénéficier de la réduction de 30%</label>
      </div>

      {bookingData.isStudent && (
        <div className="p-3 bg-yellow-100 rounded-md text-sm text-yellow-900 border border-yellow-200">⚠️ Votre statut étudiant sera vérifié le jour du rendez-vous. Merci de vous munir de votre carte d'étudiant en cours de validité. En cas de non-présentation, le tarif plein sera appliqué.</div>
      )}

      <div className="flex items-center space-x-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
         <input 
            type="checkbox" 
            id="docs"
            name="hasDocs" 
            checked={bookingData.hasDocs} 
            onChange={handleCheckboxChange} 
            className="h-5 w-5 text-brand-red focus:ring-brand-red border-gray-300 rounded"
         />
         <label htmlFor="docs" className="text-sm text-zinc-700">Je possède des photos des papiers/carnet (à envoyer après)</label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" onClick={prevStep} className="flex-1">Retour</Button>
        <Button 
            className="flex-1"
            onClick={nextStep}
            disabled={!bookingData.clientName || !bookingData.clientPhone || !bookingData.city}
        >
            Suivant
        </Button>
      </div>
    </div>
  );

  // UI for Step 3: Payment
  const renderPayment = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-xl font-bold mb-2">3. Paiement de l'acompte</h3>
      
      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-200">
           <span className="font-semibold text-zinc-600">Prestation</span>
           <span className="font-bold">Accompagnement Achat</span>
        </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-zinc-600">Total</span>
            <span className="font-bold">{bookingData.isStudent ? '100,00 €' : '150,00 €'}</span>
          </div>
        <div className="flex justify-between items-center text-lg">
           <span className="font-bold text-brand-red">Acompte à régler</span>
           <span className="font-bold text-brand-red">20,00 €</span>
        </div>
        <p className="text-xs text-zinc-500 mt-2 italic">Le solde ({bookingData.isStudent ? '80€' : '130€'}) sera à régler sur place.</p>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-xs text-red-800">
          <strong>Politique d'annulation :</strong> <br/>
          &bull; Annulation {'>'} 2h avant : Acompte remboursé.<br/>
          &bull; Annulation {'<'} 2h avant ou absence : Acompte perdu.<br/>
          &bull; Retard {'>'} 20 min : RDV considéré comme annulé.
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" onClick={prevStep} className="flex-1">Retour</Button>
          <Button 
            className="flex-1"
            onClick={() => simulatePayment()}
            isLoading={isProcessing}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Payer 20€ (Stripe)
          </Button>
      </div>
      <p className="text-center text-xs text-zinc-400 mt-2">Paiement sécurisé via Stripe</p>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center py-12 animate-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-black mb-4">Réservation Confirmée !</h2>
      <p className="text-zinc-600 mb-8 max-w-md mx-auto">
        Merci <strong>{bookingData.clientName}</strong>. Votre rendez-vous est bloqué pour le <strong>{bookingData.date}</strong> à <strong>{bookingData.timeSlot}</strong>.
      </p>
      <div className="bg-zinc-50 p-4 rounded-lg max-w-sm mx-auto mb-8 border border-zinc-200">
        <p className="text-sm text-zinc-500">Un email de confirmation et votre facture d'acompte ont été envoyés à votre adresse (simulée).</p>
      </div>
      <Button onClick={() => window.location.reload()}>Nouvelle réservation</Button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-brand-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-5xl font-black mb-4">Accompagnement Achat</h1>
            <p className="text-xl text-zinc-400">L'expertise YassAuto pour acheter sereinement.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Service Details */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-brand-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">€</span>
            Tarifs & Ce qui est inclus
          </h2>
          
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm mb-8">
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-black text-brand-black">150€</span>
              <span className="text-zinc-500 ml-2">/ premier déplacement</span>
            </div>
            <p className="text-sm text-zinc-600 mb-6 border-b border-zinc-200 pb-4">
              Si le véhicule n'est pas acheté, le prochain déplacement est à <strong>100€</strong>.
            </p>
            
            <ul className="space-y-6">
               <li className="flex gap-4">
                 <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
                    <MapPin className="w-5 h-5 text-brand-red" />
                 </div>
                 <div>
                    <h4 className="font-bold text-zinc-900">1. Déplacement inclus</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Intervention à Montpellier et dans un rayon de 30 minutes, sans supplément. Déplacement directement au lieu du rendez-vous.
                    </p>
                 </div>
               </li>
               
               <li className="flex gap-4">
                 <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
                    <Laptop className="w-5 h-5 text-brand-red" />
                 </div>
                 <div>
                    <h4 className="font-bold text-zinc-900">2. Diagnostic électronique professionnel</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Lecture des défauts moteur, airbag, ABS, FAP, boîte, etc. Détection des anomalies non visibles à l’œil nu.
                    </p>
                 </div>
               </li>

               <li className="flex gap-4">
                 <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
                    <Wrench className="w-5 h-5 text-brand-red" />
                 </div>
                 <div>
                    <h4 className="font-bold text-zinc-900">3. Inspection mécanique complète</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Vérification des fuites, freins, suspensions, pneus, turbo, distribution, châssis… Évaluation précise de l’état général.
                    </p>
                 </div>
               </li>

               <li className="flex gap-4">
                 <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
                    <Car className="w-5 h-5 text-brand-red" />
                 </div>
                 <div>
                    <h4 className="font-bold text-zinc-900">4. Essai routier (si possible)</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Test moteur, accélération, freinage, direction, embrayage, vibrations. Analyse du comportement global.
                    </p>
                 </div>
               </li>

               <li className="flex gap-4">
                 <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
                    <FileCheck className="w-5 h-5 text-brand-red" />
                 </div>
                 <div>
                    <h4 className="font-bold text-zinc-900">5. Vérification de tous les documents</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Carte grise, contrôle technique, identités, factures, historique SIA. Contrôle de la conformité administrative.
                    </p>
                 </div>
               </li>

               <li className="flex gap-4">
                 <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
                    <ClipboardList className="w-5 h-5 text-brand-red" />
                 </div>
                 <div>
                    <h4 className="font-bold text-zinc-900">6. Devis mécanique fourni sur place</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Évaluation des réparations éventuelles. Devis réalisé par notre garage partenaire pour un coût réel et transparent.
                    </p>
                 </div>
               </li>

               <li className="flex gap-4">
                 <div className="mt-1 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-sm h-fit">
                    <FileText className="w-5 h-5 text-brand-red" />
                 </div>
                 <div>
                    <h4 className="font-bold text-zinc-900">7. Aide à la carte grise</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Assistance pour préparer les documents et aide pour réaliser la carte grise en ligne en votre nom.
                    </p>
                 </div>
               </li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-brand-red" /> Zones d'intervention (Sans supplément)</h3>
            <div className="flex flex-wrap gap-2">
                {SERVICE_ZONES.map(zone => (
                    <span key={zone} className="bg-zinc-100 text-zinc-800 px-3 py-1 rounded-full text-sm font-medium border border-zinc-200">
                        {zone}
                    </span>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Wizard */}
        <div id="reservation" className="relative">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-100 sticky top-24">
            {currentStep !== Step.CONFIRMATION && (
              <div className="mb-8">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-zinc-400">ÉTAPE {currentStep} / 3</span>
                    <span className="text-sm font-bold text-brand-red">
                        {currentStep === 1 ? 'Date' : currentStep === 2 ? 'Infos' : 'Paiement'}
                    </span>
                 </div>
                 <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-brand-red h-full transition-all duration-300 ease-out"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    ></div>
                 </div>
              </div>
            )}

            {currentStep === Step.DATE_SELECTION && renderDateSelection()}
            {currentStep === Step.DETAILS && renderDetailsForm()}
            {currentStep === Step.PAYMENT && renderPayment()}
            {currentStep === Step.CONFIRMATION && renderConfirmation()}

          </div>
        </div>

      </div>
    </div>
  );
};