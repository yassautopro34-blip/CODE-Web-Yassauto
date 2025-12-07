export interface BookingDetails {
  clientName: string;
  clientPhone: string;
  description: string;
  status: "pending" | "confirmed" | "canceled" | "failed";
  amount_cents: number;
  currency: string;
  date: string;
  timeSlot: string;
  postLink: string;
  carModel: string;
  address: string;
  hasDocs: boolean;
  clientEmail: string;
  isStudent: boolean;
  bookingDate: string;
  bookingType: string;
  confirmedAt: string;
}

export interface MechanicQuote {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licensePlate: string;
  requestType: "repair" | "diag"; // 'repair' = sait ce qu'il veut, 'diag' = ne sait pas
  issueDescription: string;
  hasPhotos: boolean;
}

export enum Step {
  DATE_SELECTION = 1,
  DETAILS = 2,
  PAYMENT = 3,
  CONFIRMATION = 4,
}

export const TIME_SLOTS = ["09:00", "11:00", "14:00", "16:00", "18:00"];

export const SERVICE_ZONES = [
  "Montpellier",
  "Sète",
  "Nîmes",
  "Lunel",
  "Mauguio",
  "Castelnau",
  "Rayon 30 min",
];
