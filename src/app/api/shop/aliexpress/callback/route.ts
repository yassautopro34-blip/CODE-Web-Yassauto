import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { AliExpressError, createToken } from "@/lib/shop/aliexpress/client";
import { saveTokens } from "@/lib/shop/aliexpress/token";
import { getOAuthBaseUrl } from "@/lib/shop/aliexpress/oauth-url";

/**
 * La valeur `state`, liée au cookie posé par /connect, valide le retour OAuth indépendamment
 * de la session admin, qui peut être absente sur une navigation depuis AliExpress.
 */
export async function GET(req: NextRequest) {
  const back = (status: string, detail?: string) => {
    const q = new URLSearchParams({ aliexpress: status });
    if (detail) q.set("detail", detail.slice(0, 200));
    return NextResponse.redirect(`${getOAuthBaseUrl()}/admin/boutique?${q}`);
  };

  const code = req.nextUrl.searchParams.get("code");
  const oauthError = req.nextUrl.searchParams.get("error");
  const oauthErrorDescription = req.nextUrl.searchParams.get("error_description");
  const state = req.nextUrl.searchParams.get("state") ?? "";
  const expected = req.cookies.get("ae_oauth_state")?.value ?? "";

  if (oauthError) {
    return back("erreur", [oauthError, oauthErrorDescription].filter(Boolean).join(" : "));
  }
  if (!code) return back("refuse", oauthErrorDescription ?? "Aucun code reçu d'AliExpress");
  if (!expected) return back("refuse", "Cookie de sécurité absent (lance la connexion depuis www.yassauto.fr/admin/boutique)");
  if (state.length !== expected.length || !timingSafeEqual(Buffer.from(state), Buffer.from(expected))) {
    return back("refuse", "Code de sécurité différent : relance la connexion");
  }

  try {
    await saveTokens(await createToken(code));
    const res = back("ok");
    res.cookies.set("ae_oauth_state", "", { path: "/api/shop/aliexpress", maxAge: 0 });
    return res;
  } catch (error) {
    const payload = error instanceof AliExpressError ? error.payload : undefined;
    console.error("AliExpress OAuth callback failed:", error, JSON.stringify(payload));
    const p = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : undefined;
    const nested = p?.error_response && typeof p.error_response === "object"
      ? (p.error_response as Record<string, unknown>)
      : undefined;
    const apiCode = p?.code ?? nested?.code;
    const apiMessage = p?.message ?? p?.msg ?? p?.error_description ?? nested?.message ?? nested?.msg;
    const detail = [
      apiCode ? `AliExpress ${String(apiCode)}` : undefined,
      apiMessage ? String(apiMessage) : undefined,
    ].filter(Boolean).join(" : ") || (error instanceof Error ? error.message : "Erreur inconnue");
    return back("erreur", detail);
  }
}
