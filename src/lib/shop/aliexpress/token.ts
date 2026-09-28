import { connectToMongoDB } from "@/lib/db";
import ShopSettings from "@/lib/models/shop-settings";
import { decrypt, encrypt } from "@/lib/shop/crypto";
import { refreshToken } from "./client";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expire_time: number; // timestamp ms
  refresh_token_valid_time: number; // timestamp ms
  account?: string;
  user_nick?: string;
};

export async function saveTokens(t: TokenResponse) {
  await connectToMongoDB();
  await ShopSettings.findOneAndUpdate(
    { key: "main" },
    {
      $set: {
        aliexpress: {
          accessTokenEnc: encrypt(t.access_token),
          refreshTokenEnc: encrypt(t.refresh_token),
          accessExpiresAt: new Date(Number(t.expire_time)),
          refreshExpiresAt: new Date(Number(t.refresh_token_valid_time)),
          accountName: t.account ?? t.user_nick,
          connectedAt: new Date(),
        },
      },
    },
    { upsert: true },
  );
}

export async function getConnectionStatus() {
  await connectToMongoDB();
  const s = await ShopSettings.findOne({ key: "main" }).lean();
  const ae = s?.aliexpress;
  if (!ae?.accessTokenEnc) return { connected: false as const };
  return {
    connected: true as const,
    accountName: ae.accountName,
    accessExpiresAt: ae.accessExpiresAt,
    refreshExpiresAt: ae.refreshExpiresAt,
  };
}

/** Renvoie un access token valide, en le rafraîchissant s'il expire dans moins de 24 h. */
export async function getValidAccessToken(): Promise<string> {
  await connectToMongoDB();
  const s = await ShopSettings.findOne({ key: "main" }).lean();
  const ae = s?.aliexpress;
  if (!ae?.accessTokenEnc) throw new Error("AliExpress n'est pas connecté (Admin > Boutique > Réglages)");

  const soon = Date.now() + 24 * 3600 * 1000;
  if (new Date(ae.accessExpiresAt).getTime() > soon) return decrypt(ae.accessTokenEnc);

  if (new Date(ae.refreshExpiresAt).getTime() < Date.now()) {
    throw new Error("Connexion AliExpress expirée : reconnecte ton compte depuis les Réglages");
  }
  const fresh = await refreshToken(decrypt(ae.refreshTokenEnc));
  await saveTokens(fresh);
  return fresh.access_token;
}
