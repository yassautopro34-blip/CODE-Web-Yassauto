import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, getAdminPassword } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
    }

    if (password !== getAdminPassword()) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Service indisponible" }, { status: 503 });
  }
}