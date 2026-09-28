import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { getConnectionStatus } from "@/lib/shop/aliexpress/token";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getConnectionStatus());
}
