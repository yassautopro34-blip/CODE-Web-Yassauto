
const BookingConfirmation = () => {
  // Simuler les props qui viendraient normalement de votre backend ou formulaire
  // Vous pouvez modifier ces valeurs pour tester les différents états
  const data = {
    bookingTypeLabel: "Accompagnement Achat Véhicule",
    bookingDateTime: "Samedi 24 Octobre à 14:00",
    clientName: "Thomas Dupont",
    clientPhone: "06 12 34 56 78",
    description: "Recherche Peugeot 208 ou Clio 5, budget max 15k.",
    bookingType: "accompagnement", // Changez ceci en 'autre' pour cacher la section prix
    isStudentFlag: true, // Changez à false pour voir le tarif normal
    totalCents: 10500, // 105.00€ (Prix étudiant simulé)
    depositCents: 3000, // 30.00€
  };

  // Calcul du solde
  const balanceCents = data.totalCents - data.depositCents;

  // Fonction utilitaire pour formater les prix
  const formatPrice = (cents: number) => (cents / 100).toFixed(2) + " €";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg overflow-hidden">
        {/* En-tête */}
        <div className="bg-brand-red p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">
            Bienvenue chez YassAuto ! 🚗
          </h2>
          <p className="text-blue-100 opacity-90">
            Merci pour votre confiance.
          </p>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            Votre rendez-vous a bien été enregistré. Voici le récapitulatif :
          </p>

          {/* Tableau de détails (Style Carte) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 text-sm md:text-base">
            <div className="bg-gray-50 p-3 font-semibold text-gray-700 border-b border-gray-200">
              Détails de la réservation
            </div>

            <div className="divide-y divide-gray-100">
              <Row label="Type de service" value={data.bookingTypeLabel} />
              <Row label="Date & Heure" value={data.bookingDateTime} />
              <Row label="Votre nom" value={data.clientName} />
              <Row label="Téléphone" value={data.clientPhone || "Non fourni"} />
              <Row
                label="Description"
                value={data.description || "Aucune description"}
              />

              {/* Section conditionnelle : Prix */}
              {data.bookingType === "accompagnement" && (
                <>
                  <Row
                    label="Prix total"
                    value={
                      <span>
                        {formatPrice(data.totalCents)} TTC
                        {data.isStudentFlag && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Tarif étudiant -30%
                          </span>
                        )}
                      </span>
                    }
                    highlight
                  />
                  <Row
                    label="Acompte payé"
                    value={`${formatPrice(data.depositCents)} TTC`}
                    className="text-green-600"
                  />
                  <Row
                    label="Reste à régler"
                    value={`${formatPrice(balanceCents)} TTC`}
                    className="font-bold text-brand-red bg-blue-50"
                  />
                </>
              )}
            </div>
          </div>

          {/* Alerte Étudiant Conditionnelle */}
          {data.isStudentFlag && (
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* Icone Warning */}
                  <svg
                    className="h-5 w-5 text-amber-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Vérification requise
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Votre statut étudiant sera vérifié le jour du rendez-vous.
                      Merci de vous munir de votre carte d'étudiant en cours de
                      validité.
                    </p>
                    <p className="mt-2 text-xs opacity-80">
                      En cas de non-présentation, le tarif plein (150 €) sera
                      appliqué, soit un solde de
                      <strong className="mx-1">
                        {formatPrice(15000 - data.depositCents)}
                      </strong>
                      au lieu de {formatPrice(balanceCents)}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pied de page / Contact */}
          <div className="text-center border-t pt-6">
            <p className="text-gray-700 mb-2 font-medium">
              Contact : 06 48 38 05 68
            </p>
            <p className="text-gray-500 text-sm">Merci et à bientôt ! 👍</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({
  label = "",
  value,
  className = "",
  highlight = false,
}: {
  label: string;
  value: any;
  className?: string;
  highlight?: boolean;
}) => (
  <div
    className={`grid grid-cols-3 p-3 gap-4 ${highlight ? "bg-gray-50" : ""} ${className}`}
  >
    <dt className="col-span-1 text-gray-500 font-medium text-sm flex items-center">
      {label}
    </dt>
    <dd className="col-span-2 text-gray-900 font-medium break-words">
      {value}
    </dd>
  </div>
);

export default BookingConfirmation;
