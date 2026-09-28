import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createToken } from "@/lib/shop/aliexpress/client";
import { saveTokens } from "@/lib/shop/aliexpress/token";

/**
 * Retour OAuth AliExpress. La session admin (SameSite=Strict) n'est pas envoyée sur cette
 * redirection inter-sites : c'est le paramètre `state`, lié au cookie posé par /connect, qui prouve
 * que la demande vient bien de l'admin.
 */
export async function GET(req: NextRequest) {
  const back = (status: string) =>
    NextResponse.redirect(`${process.env.FRONTEND_URL}/admin?boutique=aliexpress-${status}`);

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? "";
  const expected = req.cookies.get("ae_oauth_state")?.value ?? "";

  const valid =
    code &&
    state.length === expected.length &&
    expected.length > 0 &&
    timingSafeEqual(Buffer.from(state), Buffer.from(expected));
  if (!valid) return back("refuse");

  try {
    await saveTokens(await createToken(code));
    const res = back("ok");
    res.cookies.delete("ae_oauth_state");
    return res;
  } catch (error) {
    console.error("AliExpress OAuth callback failed:", error);
    return back("erreur");
  }
}
