import mongoose, { Document, Model } from "mongoose";
import { MechanicQuote } from "@/types";

export interface IQuoteDocument extends MechanicQuote, Document {
  status: "pending" | "confirmed" | "cancelled" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new mongoose.Schema<IQuoteDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    licensePlate: { type: String, required: true },
    requestType: { type: String, enum: ["repair", "diag"], required: true },
    issueDescription: { type: String, required: true },
    hasPhotos: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Quote: Model<IQuoteDocument> =
  mongoose.models?.Quote || mongoose.model("Quote", quoteSchema);

export default Quote;
