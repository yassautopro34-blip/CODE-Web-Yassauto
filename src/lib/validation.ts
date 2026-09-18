import { z } from "zod";

const frenchPhone = /^\+?33[1-9]\d{8}$|^0[1-9](?:[ .-]?\d{2}){4}$/;

const honeypot = z.object({
  website: z.string().max(0).optional(),
});

export const mechanicQuoteSchema = z
  .object({
    firstName: z.string().trim().min(2).max(80),
    lastName: z.string().trim().min(2).max(80),
    phone: z.string().trim().regex(frenchPhone, "Téléphone invalide"),
    email: z.string().trim().email().max(160),
    licensePlate: z.string().trim().min(2).max(20),
    requestType: z.enum(["repair", "diag"]),
    issueDescription: z.string().trim().min(5).max(2000),
    hasPhotos: z.boolean().default(false),
  })
  .merge(honeypot);

export const bookingRequestSchema = z
  .object({
    clientName: z.string().trim().min(2).max(120),
    clientPhone: z.string().trim().regex(frenchPhone, "Téléphone invalide"),
    clientEmail: z.string().trim().email().max(160),
    date: z.string().trim().min(8).max(40),
    timeSlot: z.string().trim().min(2).max(20),
    address: z.string().trim().max(160).optional().default(""),
    carModel: z.string().trim().max(120).optional().default(""),
    postLink: z.string().trim().url().max(500).or(z.literal("")),
    hasDocs: z.boolean().default(false),
    isStudent: z.boolean().default(false),
  })
  .merge(honeypot);

export const bookingSchema = z
  .object({
    clientName: z.string().trim().min(2).max(120),
    clientPhone: z.string().trim().regex(frenchPhone, "Téléphone invalide"),
    description: z.string().trim().max(2000),
    status: z.enum(["pending", "confirmed", "canceled", "failed"]),
    amount_cents: z.number().int().nonnegative().max(1000000),
    currency: z.literal("eur"),
    date: z.string().trim().min(8).max(40),
    timeSlot: z.string().trim().min(2).max(20),
    postLink: z.string().trim().url().max(500).or(z.literal("")),
    carModel: z.string().trim().max(120),
    address: z.string().trim().max(160),
    hasDocs: z.boolean(),
    clientEmail: z.string().trim().email().max(160),
    isStudent: z.boolean(),
    bookingDate: z.string().trim().min(8).max(40),
    bookingType: z.string().trim().max(60),
    confirmedAt: z.string().trim().max(80),
  })
  .merge(honeypot);

export const piecesRequestSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    phone: z.string().trim().regex(frenchPhone, "Téléphone invalide"),
    email: z.string().trim().email().max(160),
    licensePlate: z.string().trim().min(2).max(20),
    carModel: z.string().trim().max(120),
    vin: z.string().trim().max(40),
    partDescription: z.string().trim().min(5).max(2000),
    preference: z.enum(["new", "used", "cheapest"]),
    hasPhoto: z.boolean().default(false),
    deliveryMethod: z.enum(["pickup", "delivery-local", "delivery-france"]),
  })
  .merge(honeypot);