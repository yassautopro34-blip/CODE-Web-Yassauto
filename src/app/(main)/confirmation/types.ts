import { BookingDetails } from "@/types";

export interface StripeSession {
  id: string;
  payment_status: string;
  customer_details?: {
    email?: string | null;
  };
}

export interface ApiResponse {
  session?: StripeSession;
  booking?: BookingDetails;
  error?: string;
}
