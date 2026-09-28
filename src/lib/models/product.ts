import mongoose, { Document, Model } from "mongoose";

export type ProductStatus = "draft" | "published" | "unavailable";
export type ProductCategory = "carplay" | "led" | "ciel-etoile" | "accessoire";

export interface ProductVariant {
  sku: string; // identifiant interne
  label: string; // ex. "9 pouces - 2 Go / 32 Go"
  aeSkuAttr?: string; // attribut SKU AliExpress (ex. "14:193#Black;5:100014064")
  priceTtcCents: number;
  costCents: number; // produit + livraison + douane, au moment de la dernière sync
  available: boolean;
}

export interface VehicleFitment {
  brand: string;
  model: string;
  yearFrom?: number;
  yearTo?: number;
}

export interface IProduct {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ProductCategory;
  status: ProductStatus;
  images: string[];
  videoUrl?: string; // vidéo d'installation (YouTube ou Vercel Blob)
  variants: ProductVariant[];
  universal: boolean; // true = compatible tous véhicules
  fitments: VehicleFitment[];
  installOffer?: { enabled: boolean; priceTtcCents: number; durationMin: number };
  coefficient?: number; // surcharge du coefficient par défaut (2,5)
  supplier: {
    platform: "aliexpress";
    productId: string;
    url: string;
    logisticsServiceName?: string; // méthode d'envoi choisie (ex. "AliExpress Standard Shipping")
    deliveryDaysMin?: number;
    deliveryDaysMax?: number;
    lastSyncedAt?: Date;
  };
}

export interface IProductDocument extends IProduct, Document {
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new mongoose.Schema<ProductVariant>(
  {
    sku: { type: String, required: true },
    label: { type: String, required: true },
    aeSkuAttr: String,
    priceTtcCents: { type: Number, required: true, min: 0 },
    costCents: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema<IProductDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, enum: ["carplay", "led", "ciel-etoile", "accessoire"], required: true },
    status: { type: String, enum: ["draft", "published", "unavailable"], default: "draft", index: true },
    images: { type: [String], default: [] },
    videoUrl: String,
    variants: { type: [variantSchema], default: [] },
    universal: { type: Boolean, default: false },
    fitments: {
      type: [{ brand: String, model: String, yearFrom: Number, yearTo: Number, _id: false }],
      default: [],
    },
    installOffer: { enabled: Boolean, priceTtcCents: Number, durationMin: Number },
    coefficient: Number,
    supplier: {
      platform: { type: String, enum: ["aliexpress"], default: "aliexpress" },
      productId: { type: String, required: true },
      url: { type: String, required: true },
      logisticsServiceName: String,
      deliveryDaysMin: Number,
      deliveryDaysMax: Number,
      lastSyncedAt: Date,
    },
  },
  { timestamps: true },
);

productSchema.index({ "fitments.brand": 1, "fitments.model": 1 });

const Product: Model<IProductDocument> =
  mongoose.models?.Product || mongoose.model("Product", productSchema);

export default Product;
