import { BookingDetails } from "@/types";

export interface StripeSession {
  id: string;
  payment_status: string;
  customer_details?: {
    email?: string | null;
  };
  metadata?: {
    isStudent?: string;
    bookingDate?: string;
    bookingTime?: string;
    reservationId?: string;
  };
}

export interface ApiResponse {
  session?: StripeSession;
  booking?: BookingDetails;
  error?: string;
}
