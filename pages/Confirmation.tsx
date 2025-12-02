import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const Confirmation: React.FC = () => {
  const query = useQuery();
  const sessionId = query.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) {
        setError('Aucun session_id trouvé dans l\'URL.');
        setLoading(false);
        return;
      }

      try {
        const url = `http://localhost:4000/api/stripe-session?session_id=${encodeURIComponent(sessionId)}`;
        console.debug('[Confirmation] Fetching session from', url);
        const res = await fetch(url);

        // Try to parse JSON; if parsing fails, capture raw text for debugging
        let json: any = null;
        try {
          json = await res.json();
        } catch (parseErr) {
          const raw = await res.text();
          console.error('[Confirmation] Failed to parse JSON from /api/stripe-session, raw response:', raw);
          setError(`Erreur serveur lors de la récupération de la session Stripe: réponse non-JSON reçue.`);
          setLoading(false);
          return;
        }

        console.debug('[Confirmation] Response JSON:', json, 'status:', res.status);

        if (!res.ok) {
          setError(json.error || 'Erreur lors de la récupération du statut de paiement');
          setLoading(false);
          return;
        }
        setData(json);
      } catch (e: any) {
        console.error('[Confirmation] Network/fetch error', e);
        setError(e.message || 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  const renderSuccess = (session: any, reservation: any) => {
    const email = session?.customer_details?.email || reservation?.form?.clientEmail || 'Votre email';
    const isStudent = (session?.metadata?.isStudent === '1') || session?.metadata?.isStudent === 'true' || reservation?.form?.isStudent;

    const totalCents = reservation?.price_total_cents || (isStudent ? 10000 : 15000);
    const depositCents = reservation?.amount_cents || 2000;
    const balanceCents = totalCents - depositCents;

    const bookingDate = reservation?.form?.bookingDate || reservation?.form?.date || session?.metadata?.bookingDate || null;
    const bookingTime = reservation?.form?.bookingTime || reservation?.form?.timeSlot || session?.metadata?.bookingTime || null;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="max-w-xl w-full text-center">
          <img src="/logo192.png" alt="YassAuto" className="mx-auto w-36 mb-6" />
          <h1 className="text-3xl font-extrabold text-emerald-600 mb-2">✅ Réservation confirmée !</h1>
          <p className="text-zinc-700 mb-6">Merci pour votre confiance.</p>

          <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-200 text-left mb-6">
            <p className="mb-2">📧 Email de confirmation : <strong>{email}</strong></p>
            {bookingDate && (
              <p className="mb-1">📅 Date : <strong>{bookingDate}</strong></p>
            )}
            {bookingTime && (
              <p className="mb-2">🕐 Heure : <strong>{bookingTime}</strong></p>
            )}
            <p className="mb-1">💶 Prix total : <strong>{(totalCents/100).toFixed(0)} €{isStudent ? ' (tarif étudiant -30%)' : ''}</strong></p>
            <p className="mb-1">💳 Acompte payé : <strong>20 € TTC</strong></p>
            <p className="mb-0">💳 Solde à régler sur place : <strong>{(balanceCents/100).toFixed(0)} € TTC</strong></p>
          </div>

          <p className="text-sm text-zinc-500 mb-6">Si vous ne recevez pas l'email sous 5 minutes, vérifiez vos spams ou contactez-nous au <strong>06 48 38 05 68</strong>.</p>

          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#e30613] text-white rounded font-bold">Retour à l'accueil</button>
          </div>
        </div>
      </div>
    );
  };

  const renderFailure = (session: any, reservation: any) => {
    const email = session?.customer_details?.email || reservation?.form?.clientEmail || '';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="max-w-xl w-full text-center">
          <img src="/logo192.png" alt="YassAuto" className="mx-auto w-36 mb-6" />
          <h1 className="text-3xl font-extrabold text-red-600 mb-2">❌ Paiement non effectué</h1>
          <p className="text-zinc-700 mb-6">Votre réservation n'a pas pu être finalisée.</p>

          <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-200 text-left mb-6">
            <p className="mb-2">Le paiement n'a pas pu être traité. Cela peut arriver si :</p>
            <ul className="list-disc pl-5 mb-2 text-sm text-zinc-700">
              <li>La carte a été refusée par votre banque</li>
              <li>Vous avez annulé le paiement</li>
              <li>Un problème technique est survenu</li>
            </ul>
            <p className="mb-2">📞 06 48 38 05 68</p>
            <p className="mb-0">📧 {process.env.REACT_APP_ADMIN_EMAIL || 'contact@yassauto.fr'}</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/accompagnement')} className="px-6 py-3 bg-[#e30613] text-white rounded font-bold">Réessayer ma réservation</button>
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-zinc-100 text-zinc-800 rounded">Retour à l'accueil</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  const session = data?.session;
  const reservation = data?.reservation;
  const status = session?.payment_status || session?.payment_status || (reservation?.status === 'confirmed' ? 'paid' : 'unpaid');

  if (status === 'paid' || status === 'paid' || status === 'succeeded') {
    return renderSuccess(session, reservation);
  }

  return renderFailure(session, reservation);
};

export default Confirmation;
