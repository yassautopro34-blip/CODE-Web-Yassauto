import mongoose, { Document, Model } from "mongoose";

/** Document unique (key = "main") : réglages boutique + connexion AliExpress. */
export interface IShopSettings {
  key: "main";
  defaultCoefficient: number;
  coefficients: Record<string, number>; // par catégorie
  orderCounter: number;
  aliexpress?: {
    accessTokenEnc: string;
    refreshTokenEnc: string;
    accessExpiresAt: Date;
    refreshExpiresAt: Date;
    accountName?: string;
    connectedAt: Date;
  };
}

export interface IShopSettingsDocument extends IShopSettings, Document {}

const schema = new mongoose.Schema<IShopSettingsDocument>(
  {
    key: { type: String, default: "main", unique: true },
    defaultCoefficient: { type: Number, default: 2.5 },
    coefficients: { type: Map, of: Number, default: {} },
    orderCounter: { type: Number, default: 0 },
    aliexpress: {
      accessTokenEnc: String,
      refreshTokenEnc: String,
      accessExpiresAt: Date,
      refreshExpiresAt: Date,
      accountName: String,
      connectedAt: Date,
    },
  },
  { timestamps: true },
);

const ShopSettings: Model<IShopSettingsDocument> =
  mongoose.models?.ShopSettings || mongoose.model("ShopSettings", schema);

export default ShopSettings;
