import { NextRequest } from "next/server";

const windows = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function isRateLimited(
  request: NextRequest,
  scope: string,
  limit = 8,
  windowMs = 10 * 60 * 1000,
) {
  const key = `${scope}:${getClientIp(request)}`;
  const now = Date.now();
  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  return current.count > limit;
}

export function isHoneypotFilled(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}