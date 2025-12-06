import { BookingDetails } from "@/types";

export interface DevisDetails {
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  licensePlate: string;
  requestType: "repair" | "diag";
  issueDescription: string;
  hasPhotos: boolean;
}

interface BaseRequest {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  confirmedAt?: string;
  amount_cents?: number;
  price_total_cents?: number;
}

export interface ReservationRequest extends BaseRequest {
  type: "reservation";
  form: BookingDetails;
}

export interface DevisRequest extends BaseRequest {
  type: "devis";
  form: DevisDetails;
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

export const calculateTotals = (req: BookingDetails) => {
  const isStudent = req.bookingType === "reservation" ? req.isStudent : false;
  const defaultTotal = isStudent ? 10000 : 15000; // 100€ or 150€

  const totalCents = defaultTotal;
  const paidCents = 0;
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
    start.setDate(today.getDate() - today.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
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
