import { createHmac } from "node:crypto";

/**
 * Client minimal pour l'AliExpress Open Platform (API Dropshipping).
 * Passerelle IOP : https://api-sg.aliexpress.com
 * Signature : HMAC-SHA256 (clé = app_secret) sur la concaténation triée "clévaleur",
 * précédée du chemin d'API pour les appels /rest (ex. token).
 * ⚠️ À vérifier dans la console Open Platform au moment de l'activation :
 *    noms de méthodes, forme exacte des paramètres, format de réponse.
 */

const GATEWAY = "https://api-sg.aliexpress.com";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`);
  return value;
}

export function sign(params: Record<string, string>, apiPath = ""): string {
  const base =
    apiPath +
    Object.keys(params)
      .sort()
      .map((k) => `${k}${params[k]}`)
      .join("");
  return createHmac("sha256", env("AE_APP_SECRET")).update(base, "utf8").digest("hex").toUpperCase();
}

function baseParams(): Record<string, string> {
  return {
    app_key: env("AE_APP_KEY"),
    timestamp: Date.now().toString(),
    sign_method: "sha256",
  };
}

export class AliExpressError extends Error {
  constructor(message: string, public readonly payload?: unknown) {
    super(message);
  }
}

/** Appel d'une méthode métier (aliexpress.ds.*) via /sync. */
export async function callMethod<T = unknown>(
  method: string,
  accessToken: string,
  businessParams: Record<string, unknown> = {},
): Promise<T> {
  const params: Record<string, string> = { ...baseParams(), method, session: accessToken };
  for (const [k, v] of Object.entries(businessParams)) {
    if (v === undefined || v === null) continue;
    params[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  params.sign = sign(params);

  const res = await fetch(`${GATEWAY}/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams(params).toString(),
    cache: "no-store",
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || "error_response" in json) {
    throw new AliExpressError(`Erreur AliExpress sur ${method}`, json);
  }
  return json as T;
}

/** Échange du code OAuth contre un access token (/rest/auth/token/create). */
export async function createToken(code: string) {
  const apiPath = "/auth/token/create";
  const params: Record<string, string> = { ...baseParams(), code };
  params.sign = sign(params, apiPath);
  const res = await fetch(`${GATEWAY}/rest${apiPath}?${new URLSearchParams(params)}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || !json.access_token) throw new AliExpressError("Échec création token", json);
  return json as { access_token: string; refresh_token: string; expire_time: number; refresh_token_valid_time: number };
}

/** Rafraîchissement du token (/rest/auth/token/refresh). */
export async function refreshToken(refresh: string) {
  const apiPath = "/auth/token/refresh";
  const params: Record<string, string> = { ...baseParams(), refresh_token: refresh };
  params.sign = sign(params, apiPath);
  const res = await fetch(`${GATEWAY}/rest${apiPath}?${new URLSearchParams(params)}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || !json.access_token) throw new AliExpressError("Échec rafraîchissement token", json);
  return json as { access_token: string; refresh_token: string; expire_time: number; refresh_token_valid_time: number };
}

/** URL à ouvrir depuis l'admin pour autoriser le compte AliExpress. */
export function authorizeUrl(redirectUri: string, state: string) {
  const q = new URLSearchParams({
    response_type: "code",
    force_auth: "true",
    client_id: env("AE_APP_KEY"),
    redirect_uri: redirectUri,
    state,
  });
  return `${GATEWAY}/oauth/authorize?${q}`;
}
