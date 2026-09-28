import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getAdminSession } from "@/lib/admin-session";
import { authorizeUrl } from "@/lib/shop/aliexpress/client";
import { getOAuthBaseUrl, oauthCallbackUrl } from "@/lib/shop/aliexpress/oauth-url";

/** Admin : lance l'autorisation OAuth du compte AliExpress. */
export async function GET(req: NextRequest) {
  const base = new URL(getOAuthBaseUrl());
  // Le cookie de sécurité doit être posé sur le même domaine que le retour AliExpress.
  if (req.nextUrl.host !== base.host && !req.nextUrl.hostname.endsWith("localhost")) {
    return NextResponse.redirect(`${base.origin}/api/shop/aliexpress/connect`);
  }
  if (!(await getAdminSession())) {
    return NextResponse.redirect(`${base.origin}/admin/login`);
  }
  const state = randomBytes(24).toString("hex");
  const res = NextResponse.redirect(authorizeUrl(oauthCallbackUrl(), state));
  // SameSite=Lax : le cookie doit revenir lors de la redirection depuis aliexpress.com
  res.cookies.set("ae_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/api/shop/aliexpress",
  });
  return res;
}
