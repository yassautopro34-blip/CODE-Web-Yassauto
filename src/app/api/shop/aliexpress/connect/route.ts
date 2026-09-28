import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getAdminSession } from "@/lib/admin-session";
import { authorizeUrl } from "@/lib/shop/aliexpress/client";

/** Admin : lance l'autorisation OAuth du compte AliExpress. */
export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const state = randomBytes(24).toString("hex");
  const redirectUri = `${process.env.FRONTEND_URL}/api/shop/aliexpress/callback`;
  const res = NextResponse.redirect(authorizeUrl(redirectUri, state));
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
