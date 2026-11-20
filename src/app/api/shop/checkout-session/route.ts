import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import ShopOrder, { IShopOrder, ShopOrderLine } from "@/lib/models/shop-order";
import ShopSettings from "@/lib/models/shop-settings";
import Product from "@/lib/models/product";
import { connectToMongoDB } from "@/lib/db";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" })
  : null;
const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";

const checkoutInput = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    // Téléphone français obligatoire : le transporteur l'utilise pour la livraison
    phone: z.string().trim().regex(/^(?:\+33\s?|0033\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/, "Numéro de téléphone français invalide"),
  }),
  shippingAddress: z.object({
    line1: z.string().trim().max(160).default(""),
    line2: z.string().trim().max(160).optional().default(""),
    zip: z.string().trim().max(16).default(""),
    city: z.string().trim().max(100).default(""),
    province: z.string().trim().max(100).optional(),
    country: z.literal("FR").default("FR"),
  }),
  deliveryMode: z.enum(["home", "workshop_pickup", "workshop_install"]),
  lines: z.array(z.object({
    productId: z.string().min(1).max(64),
    sku: z.string().min(1).max(80),
    quantity: z.number().int().min(1).max(10),
    install: z.boolean().default(false),
  })).min(1).max(20),
  shippingDataAcknowledged: z.literal(true),
});

export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ error: "Le paiement n'est pas configuré." }, { status: 503 });

  const parsed = checkoutInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Vérifie les coordonnées et les informations de livraison." }, { status: 400 });
  }

  const input = parsed.data;
  const hasInstall = input.lines.some((line) => line.install);
  if ((hasInstall && input.deliveryMode !== "workshop_install") || (!hasInstall && input.deliveryMode === "workshop_install")) {
    return NextResponse.json({ error: "Le mode de retrait ne correspond pas à l'option de pose." }, { status: 400 });
  }
  if (input.deliveryMode === "home" && (!input.shippingAddress.line1 || !input.shippingAddress.zip || !input.shippingAddress.city)) {
    return NextResponse.json({ error: "Une adresse complète est nécessaire pour la livraison à domicile." }, { status: 400 });
  }

  let orderId: string | undefined;
  try {
    await connectToMongoDB();
    const requestedIds = [...new Set(input.lines.map((line) => line.productId))];
    const products = await Product.find({ _id: { $in: requestedIds }, status: "published" }).lean();
    const productById = new Map(products.map((product) => [String(product._id), product]));
    const orderLines: ShopOrderLine[] = [];
    const stripeLines: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const requested of input.lines) {
      const product = productById.get(requested.productId);
      if (!product) return NextResponse.json({ error: "Un produit du panier n'est plus disponible." }, { status: 409 });
      const variant = product.variants.find((item) => item.sku === requested.sku);
      if (!variant || !variant.available || !product.supplier?.productId) {
        return NextResponse.json({ error: `La variante ${product.title} n'est plus disponible.` }, { status: 409 });
      }
      if (requested.install && !product.installOffer?.enabled) {
        return NextResponse.json({ error: `La pose n'est plus disponible pour ${product.title}.` }, { status: 409 });
      }

      const installPriceCents = requested.install ? product.installOffer?.priceTtcCents ?? 0 : 0;
      orderLines.push({
        productId: String(product._id),
        sku: variant.sku,
        title: product.title,
        variantLabel: variant.label,
        quantity: requested.quantity,
        unitPriceTtcCents: variant.priceTtcCents,
        unitCostCents: variant.costCents,
        aeProductId: product.supplier.productId,
        aeSkuAttr: variant.aeSkuAttr,
        logisticsServiceName: product.supplier.logisticsServiceName,
        installPriceTtcCents: installPriceCents || undefined,
      });
      stripeLines.push({
        quantity: requested.quantity,
        price_data: {
          currency: "eur",
          unit_amount: variant.priceTtcCents,
          product_data: { name: `${product.title} — ${variant.label}`.slice(0, 250) },
        },
      });
      if (installPriceCents > 0) {
        stripeLines.push({
          quantity: requested.quantity,
          price_data: {
            currency: "eur",
            unit_amount: installPriceCents,
            product_data: { name: `Pose atelier — ${product.title}`.slice(0, 250) },
          },
        });
      }
    }

    const settings = await ShopSettings.findOneAndUpdate(
      { key: "main" },
      { $inc: { orderCounter: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    const number = `YA-${new Date().getFullYear()}-${String(settings.orderCounter).padStart(4, "0")}`;
    const totalTtcCents = orderLines.reduce((total, line) => total + (line.unitPriceTtcCents + (line.installPriceTtcCents ?? 0)) * line.quantity, 0);
    const shippingAddress = {
      fullName: input.customer.name,
      phone: input.customer.phone,
      line1: input.shippingAddress.line1,
      line2: input.shippingAddress.line2,
      zip: input.shippingAddress.zip,
      city: input.shippingAddress.city,
      province: input.shippingAddress.province,
      country: "FR" as const,
    };
    const order: IShopOrder = {
      number,
      status: "pending_payment",
      customer: { ...input.customer },
      shippingAddress,
      delivery: { mode: input.deliveryMode, feeCents: 0 },
      lines: orderLines,
      totalTtcCents,
      shippingDataAcknowledgedAt: new Date(),
      history: [{ at: new Date(), status: "pending_payment", note: "Commande créée avant le paiement Stripe." }],
    };
    const savedOrder = await ShopOrder.create(order);
    orderId = String(savedOrder._id);

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: input.customer.email,
        client_reference_id: number,
        line_items: stripeLines,
        metadata: { shopOrderId: orderId, shopOrderNumber: number },
        success_url: `${frontendBase}/boutique/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendBase}/boutique/panier?paiement=annule`,
      }, { idempotencyKey: `shop-order-${orderId}` });
      if (!session.url) throw new Error("Stripe n'a pas fourni de lien de paiement.");
      await ShopOrder.findByIdAndUpdate(savedOrder._id, { stripeSessionId: session.id });
      return NextResponse.json({ url: session.url, orderNumber: number });
    } catch (error) {
      await ShopOrder.findByIdAndUpdate(savedOrder._id, {
        $set: { status: "cancelled" },
        $push: { history: { at: new Date(), status: "cancelled", note: "La session de paiement n'a pas pu être créée." } },
      });
      throw error;
    }
  } catch (error) {
    console.error("Shop checkout session error:", { orderId, error });
    return NextResponse.json({ error: "Impossible de préparer le paiement. Réessaie dans un instant." }, { status: 500 });
  }
}