/**
 * URL de base utilisée UNIQUEMENT pour le flux OAuth AliExpress.
 * La production force www.yassauto.fr : si FRONTEND_URL pointe sur le domaine nu,
 * le cookie de sécurité (posé sur www) ne revient pas au retour et l'adresse de retour
 * ne correspond plus à celle enregistrée dans la console AliExpress.
 * Les URL locales (localhost) et les autres domaines ne sont pas modifiés.
 */
export function getOAuthBaseUrl(): string {
  const raw = process.env.AE_OAUTH_BASE_URL || process.env.FRONTEND_URL || "https://www.yassauto.fr";
  const url = new URL(raw);
  if (url.hostname === "yassauto.fr") {
    url.hostname = "www.yassauto.fr";
    url.protocol = "https:";
  }
  return url.origin;
}

export const oauthCallbackUrl = () => `${getOAuthBaseUrl()}/api/shop/aliexpress/callback`;
