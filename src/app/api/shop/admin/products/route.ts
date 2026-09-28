import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { connectToMongoDB } from "@/lib/db";
import Product from "@/lib/models/product";
import { productInput } from "@/lib/shop/product-schema";

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectToMongoDB();
  const products = await Product.find({}).sort({ updatedAt: -1 }).lean();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = productInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", issues: parsed.error.issues }, { status: 400 });
  }
  await connectToMongoDB();
  if (await Product.exists({ slug: parsed.data.slug })) {
    return NextResponse.json({ error: "Ce slug existe déjà, modifie-le" }, { status: 409 });
  }
  const product = await Product.create({ ...parsed.data, supplier: { ...parsed.data.supplier, lastSyncedAt: new Date() } });
  return NextResponse.json(product, { status: 201 });
}
