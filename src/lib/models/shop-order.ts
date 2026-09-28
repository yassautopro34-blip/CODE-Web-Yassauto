import mongoose, { Document, Model } from "mongoose";

export type ShopOrderStatus =
  | "pending_payment" // en attente de paiement Stripe
  | "paid" // payée : à valider par l'admin
  | "sent_to_supplier" // commande créée chez AliExpress, à régler
  | "supplier_paid" // réglée sur AliExpress
  | "shipped" // numéro de suivi reçu
  | "delivered"
  | "ready_for_pickup" // colis arrivé à l'atelier
  | "picked_up"
  | "refunded"
  | "cancelled";

export type DeliveryMode = "home" | "relay" | "workshop_pickup" | "workshop_install";

export interface ShopOrderLine {
  productId: string;
  sku: string;
  title: string;
  variantLabel: string;
  quantity: number;
  unitPriceTtcCents: number;
  unitCostCents: number; // figé au moment de la commande (marge réelle)
  aeProductId: string;
  aeSkuAttr?: string;
  logisticsServiceName?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string; // format international, ex. +33612345678
  line1: string;
  line2?: string;
  zip: string;
  city: string;
  province?: string;
  country: "FR";
}

export interface IShopOrder {
  number: string; // YA-2026-0001
  status: ShopOrderStatus;
  customer: { name: string; email: string; phone: string };
  shippingAddress: ShippingAddress; // adresse saisie par le client
  delivery: { mode: DeliveryMode; relayPointId?: string; feeCents: number };
  lines: ShopOrderLine[];
  totalTtcCents: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  supplier?: {
    aeOrderIds: string[];
    trackingNumbers: string[];
    lastError?: string;
  };
  history: { at: Date; status: ShopOrderStatus; note?: string }[];
}

export interface IShopOrderDocument extends IShopOrder, Document {
  createdAt: Date;
  updatedAt: Date;
}

const shopOrderSchema = new mongoose.Schema<IShopOrderDocument>(
  {
    number: { type: String, required: true, unique: true },
    status: { type: String, required: true, default: "pending_payment", index: true },
    customer: { name: String, email: String, phone: String },
    shippingAddress: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      zip: String,
      city: String,
      province: String,
      country: { type: String, default: "FR" },
    },
    delivery: { mode: String, relayPointId: String, feeCents: { type: Number, default: 0 } },
    lines: [
      {
        _id: false,
        productId: String,
        sku: String,
        title: String,
        variantLabel: String,
        quantity: Number,
        unitPriceTtcCents: Number,
        unitCostCents: Number,
        aeProductId: String,
        aeSkuAttr: String,
        logisticsServiceName: String,
      },
    ],
    totalTtcCents: { type: Number, required: true },
    stripeSessionId: { type: String, index: true },
    stripePaymentIntentId: String,
    supplier: { aeOrderIds: [String], trackingNumbers: [String], lastError: String },
    history: [{ _id: false, at: Date, status: String, note: String }],
  },
  { timestamps: true },
);

const ShopOrder: Model<IShopOrderDocument> =
  mongoose.models?.ShopOrder || mongoose.model("ShopOrder", shopOrderSchema);

export default ShopOrder;
