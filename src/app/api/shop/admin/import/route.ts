import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-session";
import { getValidAccessToken } from "@/lib/shop/aliexpress/token";
import { buildImportPreview } from "@/lib/shop/aliexpress/products";

const bodySchema = z.object({
  url: z.string().trim().min(8).max(1000),
  coefficient: z.number().min(1).max(10).optional(),
});

/** Admin : colle une URL AliExpress -> aperçu de fiche avec prix calculés (rien n'est enregistré). */
export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "URL invalide" }, { status: 400 });
  }
  try {
    const token = await getValidAccessToken();
    const preview = await buildImportPreview(parsed.data.url, token, parsed.data.coefficient);
    return NextResponse.json(preview);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import impossible";
    console.error("Import AliExpress:", error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
