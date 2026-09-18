import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";
import { createHash } from "node:crypto";

const COOKIE_NAME = "yassauto_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 12) {
    throw new Error("ADMIN_SECRET must contain at least 12 characters");
  }
  return createHash("sha256").update(secret).digest();
}

export async function createAdminSession() {
  const token = await new EncryptJWT({ role: "admin" })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .encrypt(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export async function getAdminSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtDecrypt(token, getSecret());
    if (payload.sub !== "admin" || payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}

export function getAdminSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not configured");
  return secret;
}