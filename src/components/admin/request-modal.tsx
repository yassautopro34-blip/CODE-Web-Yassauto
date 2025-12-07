import {
  calculateTotals,
  AdminRequest,
  RequestType,
  RequestStatus,
} from "./admin-utils";
import { Phone, Mail } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";

interface Props {
  request: AdminRequest;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    status: RequestStatus,
    bookingType: RequestType,
  ) => void;
}

export function RequestModal({ request, onClose, onUpdateStatus }: Props) {
  const isReservation = request.bookingType === "reservation";
  const totals = calculateTotals(request);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-black text-white p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold">
            {isReservation ? "Réservation" : "Demande de devis"}
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-gray-300">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <InfoBlock label="ID" value={request._id} mono />
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Statut
              </p>
              <StatusBadge status={request.status} />
            </div>
            <InfoBlock
              label="Créée"
              value={new Date(request.createdAt).toLocaleString("fr-FR")}
            />
            {request.bookingDate && (
              <InfoBlock
                label="Confirmée"
                value={new Date(request.bookingDate).toLocaleString("fr-FR")}
              />
            )}
          </div>
          <hr />

          {/* Client Info */}
          <Section title="Client">
            <p>
              <span className="text-gray-600">Nom:</span>{" "}
              <span className="font-medium">{request.clientName}</span>
            </p>
            {request.clientEmail && (
              <p>
                <span className="text-gray-600">Email:</span>{" "}
                <a
                  href={`mailto:${request.clientEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {request.clientEmail}
                </a>
              </p>
            )}
            <p>
              <span className="text-gray-600">Tél:</span>{" "}
              <a
                href={`tel:${request.clientPhone}`}
                className="text-blue-600 hover:underline"
              >
                {request.clientPhone}
              </a>
            </p>
          </Section>
          <hr />

          {/* Specific Content */}
          {isReservation ? (
            <>
              <Section title="Rendez-vous">
                <p>
                  <span className="text-gray-600">Date:</span>{" "}
                  <span className="font-medium">{request.date}</span>
                </p>
                <p>
                  <span className="text-gray-600">Heure:</span>{" "}
                  <span className="font-medium">{request.timeSlot}</span>
                </p>
              </Section>
              <hr />
              <Section title="Détails" isDescription>
                {request.description || "Aucune description"}
              </Section>
              <hr />
              <Section title="Tarifs">
                <p>
                  <span className="text-gray-600">Statut étudiant:</span>{" "}
                  <span className="font-medium">
                    {request.isStudent ? "Oui" : "Non"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Prix appliqué:</span>{" "}
                  <span className="font-medium">{totals.total} TTC</span>
                </p>
                <p>
                  <span className="text-gray-600">Acompte payé:</span>{" "}
                  <span className="font-medium text-green-600">
                    {request.amount_cents ? request.amount_cents / 100 : 0} €
                    TTC
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Solde à régler:</span>{" "}
                  <span className="font-medium">{totals.remaining}</span>
                </p>
                {request.isStudent && (
                  <p className="text-sm text-yellow-800 mt-2">
                    ⚠️ Vérifier la carte d&apos;étudiant
                  </p>
                )}
              </Section>
            </>
          ) : (
            <>
              <Section title="Demande de devis">
                <p>
                  <span className="text-gray-600">Immat:</span>{" "}
                  <span className="font-medium">
                    {request.licensePlate || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Type:</span>{" "}
                  <span className="font-medium">
                    {request.requestType === "repair"
                      ? "Réparation"
                      : "Diagnostic"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Photos:</span>{" "}
                  <span className="font-medium">
                    {request.hasPhotos ? "Oui" : "Non"}
                  </span>
                </p>
              </Section>
              <hr />
              <Section title="Problème décrit" isDescription>
                {request.issueDescription}
              </Section>
            </>
          )}
          <hr />

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <ActionBtn
                href={`tel:${request.clientPhone}`}
                icon={<Phone size={16} />}
                label="Appeler"
                color="blue"
              />
              {request.clientEmail && (
                <ActionBtn
                  href={`mailto:${request.clientEmail}`}
                  icon={<Mail size={16} />}
                  label="Email"
                  color="blue"
                />
              )}
            </div>
            {request.status !== "failed" && (
              <div className="bg-yellow-50 p-3 rounded flex gap-2">
                {request.status !== "confirmed" && (
                  <button
                    onClick={() => {
                      onUpdateStatus(
                        request._id,
                        "confirmed",
                        request.bookingType,
                      );
                      onClose();
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Marquer confirmée
                  </button>
                )}
                {request.status !== "pending" && (
                  <button
                    onClick={() => {
                      onUpdateStatus(
                        request._id,
                        "pending",
                        request.bookingType,
                      );
                      onClose();
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Remettre en attente
                  </button>
                )}
                <button
                  onClick={() => {
                    onUpdateStatus(
                      request._id,
                      "cancelled",
                      request.bookingType,
                    );
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Micro-components for Modal
interface InfoBlockProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}

const InfoBlock = ({ label, value, mono }: InfoBlockProps) => (
  <div>
    <p className="text-xs text-gray-600 uppercase font-semibold">{label}</p>
    <p className={`text-sm ${mono ? "font-mono text-lg" : ""}`}>{value}</p>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isDescription?: boolean;
}

const Section = ({ title, children, isDescription }: SectionProps) => (
  <div>
    <h3 className="text-sm font-semibold mb-3 uppercase">{title}</h3>
    <div
      className={
        isDescription
          ? "bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap break-words"
          : "space-y-2 text-sm"
      }
    >
      {children}
    </div>
  </div>
);

interface ActionBtnProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const ActionBtn = ({ href, icon, label, color }: ActionBtnProps) => (
  <a
    href={href}
    className={`px-4 py-2 bg-${color}-500 text-white rounded flex items-center gap-2 hover:bg-${color}-600 transition`}
  >
    {icon} {label}
  </a>
);
