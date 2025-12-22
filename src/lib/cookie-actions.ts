"use server";
import { cookies } from "next/headers";

export async function getCookieAction(name: string): Promise<any> {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}

export async function setConsentAction(granted: boolean) {
  const cookieStore = await cookies();

  cookieStore.set("cookie_consent", granted ? "true" : "false", {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    httpOnly: false, // Set to false so we can check it in the banner easily
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
