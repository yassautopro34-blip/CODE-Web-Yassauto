import { Eye, Phone, Mail } from "lucide-react";
import { BookingRequest } from "./admin-utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { BookingDetails } from "@/types";

interface Props {
  requests: BookingDetails[];
  loading: boolean;
  onView: (req: BookingDetails) => void;
}

export function RequestsTable({ requests, loading, onView }: Props) {
  if (loading)
    return <div className="text-center py-8 text-gray-500">Chargement...</div>;
  if (requests.length === 0)
    return <div className="text-center py-8 text-gray-500">Aucune demande</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Heure</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((req) => {
              const dateStr =
                req.bookingType === "reservation"
                  ? req.bookingDate
                  : req.createdAt.split("T")[0];
              const timeStr =
                req.type === "reservation"
                  ? req.timeSlot
                  : new Date(req.createdAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

              return (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{dateStr}</td>
                  <td className="px-4 py-3">{timeStr}</td>
                  <td className="px-4 py-3 font-medium">
                    {req.clientName}
                    {req.bookingType === "reservation" && req.isStudent && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                        Étudiant
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 space-y-1 text-xs">
                    <div className="flex items-center gap-1 text-blue-600">
                      <Phone size={12} /> {req.clientPhone}
                    </div>
                    {req.clientEmail && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Mail size={12} /> {req.clientEmail.split("@")[0]}
                        ...
                      </div>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-xs font-medium"
                    style={{
                      color:
                        req.bookingType === "devis" ? "#9333ea" : "#2563eb",
                    }}
                  >
                    {req.bookingType === "devis"
                      ? "Devis Mécanique"
                      : "Accompagnement Achat"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onView(req)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                    >
                      <Eye size={12} /> Détails
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
