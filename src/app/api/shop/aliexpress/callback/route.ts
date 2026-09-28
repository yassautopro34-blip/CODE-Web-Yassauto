import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { AliExpressError, createToken } from "@/lib/shop/aliexpress/client";
import { saveTokens } from "@/lib/shop/aliexpress/token";
import { getOAuthBaseUrl } from "@/lib/shop/aliexpress/oauth-url";

/**
 * Retour OAuth AliExpress. La session admin (SameSite=Strict) n'est pas envoyée sur cette
 * redirection inter-sites : c'est le paramètre `state`, lié au cookie posé par /connect, qui prouve
 * que la demande vient bien de l'admin.
 */
export async function GET(req: NextRequest) {
  const back = (status: string, detail?: string) => {
    const q = new URLSearchParams({ aliexpress: status });
    if (detail) q.set("detail", detail.slice(0, 200));
    return NextResponse.redirect(`${getOAuthBaseUrl()}/admin/boutique?${q}`);
  };

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? "";
  const expected = req.cookies.get("ae_oauth_state")?.value ?? "";

  if (!code) return back("refuse", "Aucun code reçu d'AliExpress");
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
    const p = payload as { code?: string; message?: string; msg?: string } | undefined;
    const detail = p?.code
      ? `AliExpress ${p.code} : ${p.message ?? p.msg ?? ""}`
      : error instanceof Error
        ? error.message
        : "Erreur inconnue";
    return back("erreur", detail);
  }
}
