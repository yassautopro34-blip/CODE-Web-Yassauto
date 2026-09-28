import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/admin-session";

const MAX_BYTES = 4 * 1024 * 1024; // les photos sont réduites côté navigateur avant envoi

/** Admin : envoi d'une photo produit vers Vercel Blob, renvoie son URL publique. */
export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Stockage photos non configuré (Vercel > Storage > Blob)" }, { status: 500 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Fichier image attendu" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Photo trop lourde (4 Mo max)" }, { status: 413 });

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-80);
  const blob = await put(`boutique/${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  return NextResponse.json({ url: blob.url });
}
