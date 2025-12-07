import { BookingDetails } from "@/types";

export type RequestType = "reservation" | "devis";
export type RequestStatus = "pending" | "confirmed" | "cancelled" | "failed";

export interface AdminRequest {
  _id: string;
  bookingType: RequestType;
  status: RequestStatus;
  createdAt: string; // ISO string
  updatedAt?: string;

  // Client Info
  clientName: string;
  clientPhone: string;
  clientEmail?: string;

  // Reservation Specific
  bookingDate?: string; // The date of the appointment
  timeSlot?: string;
  isStudent?: boolean;
  description?: string; // Additional details
  date?: string; // String representation like "Lundi 12..."

  // Quote Specific
  licensePlate?: string;
  requestType?: "repair" | "diag"; // "repair" or "diag"
  issueDescription?: string;
  hasPhotos?: boolean;

  // Payment/Money
  amount_cents?: number;
  currency?: string;
}

export type SortOrder = "asc" | "desc";

export interface FilterState {
  status: string;
  type: string;
  dateFilter: string;
  dateFrom: string;
  dateTo: string;
  sortOrder: SortOrder;
}

// --- Helper Functions ---

export const formatCurrency = (cents: number) =>
  (cents / 100).toFixed(2) + " €";

export const calculateTotals = (req: AdminRequest) => {
  if (req.bookingType === "devis") {
    return { total: "-", paid: "-", remaining: "-" };
  }

  const isStudent = req.isStudent;
  const defaultTotal = isStudent ? 10000 : 15000; // 100€ or 150€

  const totalCents = defaultTotal;
  const paidCents = 2000; // TODO: Fetch actual payment info if available
  const remainingCents = totalCents - paidCents;

  return {
    total: formatCurrency(totalCents),
    paid: formatCurrency(paidCents),
    remaining: formatCurrency(remainingCents),
  };
};

export const getDateRangeParams = (
  filter: string,
  from: string,
  to: string,
) => {
  const today = new Date();
  let fromDate = "";
  let toDate = "";

  if (filter === "today") {
    fromDate = toDate = today.toISOString().split("T")[0];
  } else if (filter === "week") {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End of week
    fromDate = start.toISOString().split("T")[0];
    toDate = end.toISOString().split("T")[0];
  } else if (filter === "month") {
    fromDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    toDate = nextMonth.toISOString().split("T")[0];
  } else if (filter === "custom" && from && to) {
    fromDate = from;
    toDate = to;
  }
  return { fromDate, toDate };
};
