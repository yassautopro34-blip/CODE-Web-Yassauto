import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { getAdminSession } from "@/lib/admin-session";
import { connectToMongoDB } from "@/lib/db";
import Product from "@/lib/models/product";
import { productInput } from "@/lib/shop/product-schema";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await connectToMongoDB();
  const product = await Product.findById(id).lean();
  return product ? NextResponse.json(product) : NextResponse.json({ error: "Introuvable" }, { status: 404 });
}

/** Mise à jour partielle (ex. { status: "published" }) ou complète. */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  const parsed = productInput.partial().safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }
  await connectToMongoDB();
  if (parsed.data.slug && (await Product.exists({ slug: parsed.data.slug, _id: { $ne: id } }))) {
    return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
  }
  const product = await Product.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  return product ? NextResponse.json(product) : NextResponse.json({ error: "Introuvable" }, { status: 404 });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await connectToMongoDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
