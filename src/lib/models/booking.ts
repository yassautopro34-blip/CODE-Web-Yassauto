import mongoose, { Document, Model } from "mongoose";
import { BookingDetails } from "@/types";

// Merging ITodo interface with mongoose's Document interface to create
// a new interface that represents a todo document in MongoDB
export interface IBookingDocument extends BookingDetails, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Defining a mongoose schema for the todo document, specifying the types
// and constraints
const bookingSchema = new mongoose.Schema<IBookingDocument>(
  {
    status: { type: String },
    clientEmail: { type: String },
    isStudent: { type: Boolean },
    bookingDate: { type: String },
    date: { type: String },
    bookingType: { type: String },
    description: { type: String },
    carModel: { type: String },
    postLink: { type: String },
    address: { type: String },
    amount_cents: { type: Number },
    currency: { type: String },
    confirmedAt: { type: String },
    clientName: { type: String },
    clientPhone: { type: String },
    hasDocs: { type: Boolean },
    timeSlot: { type: String },
  },
  {
    // Automatically add 'createdAt' and 'updated_at' fields to the document
    timestamps: true,
  },
);

// Creating a mongoose model for the todo document
const Booking: Model<IBookingDocument> =
  mongoose.models?.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
