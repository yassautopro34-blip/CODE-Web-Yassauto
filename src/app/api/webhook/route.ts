import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendAdminNotification, sendPaymentSuccessEmail, sendShopOrderConfirmationEmail } from "@/lib/email-actions";
import { updateBookingInternal } from "@/lib/booking-actions";
import ShopOrder, { IShopOrder } from "@/lib/models/shop-order";
import { connectToMongoDB } from "@/lib/db";
import { getValidAccessToken } from "@/lib/shop/aliexpress/token";
import { placeSupplierOrder } from "@/lib/shop/aliexpress/orders";

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover", // Use the latest API version you are on
    })
  : null;

async function handleShopCheckout(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.shopOrderId;
  if (!orderId || session.payment_status !== "paid") return;

  await connectToMongoDB();
  const pendingOrder = await ShopOrder.findOne({ _id: orderId, stripeSessionId: session.id, status: "pending_payment" }).lean();
  if (!pendingOrder) return;
  if (session.currency !== "eur" || session.amount_total !== pendingOrder.totalTtcCents) {
    throw new Error(`Montant Stripe incohérent pour ${pendingOrder.number}`);
  }

  const order = await ShopOrder.findOneAndUpdate(
    { _id: orderId, stripeSessionId: session.id, status: "pending_payment" },
    {
      $set: {
        status: "paid",
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      },
      $push: { history: { at: new Date(), status: "paid", note: "Paiement Stripe confirmé." } },
    },
    { new: true },
  ).lean();
  if (!order) return;
  await sendShopOrderConfirmationEmail(order as unknown as IShopOrder);

  try {
    const accessToken = await getValidAccessToken();
    const aeOrderIds = await placeSupplierOrder(order as unknown as IShopOrder, accessToken);
    const destination = order.delivery.mode === "home"
      ? `${order.shippingAddress.line1}, ${order.shippingAddress.zip} ${order.shippingAddress.city}`
      : "Retrait/pose à l'atelier de Gigean";
    await ShopOrder.findByIdAndUpdate(order._id, {
      $set: { status: "sent_to_supplier", "supplier.aeOrderIds": aeOrderIds, "supplier.trackingNumbers": [] },
      $push: { history: { at: new Date(), status: "sent_to_supplier", note: `Commande AliExpress créée (${aeOrderIds.join(", ")}); règlement fournisseur à effectuer.` } },
    });
    await sendAdminNotification(
      `La commande ${order.number} est payée par le client et créée chez AliExpress.\n\nCommande(s) fournisseur : ${aeOrderIds.join(", ")}\nClient : ${order.customer.name} — ${order.customer.email} — ${order.customer.phone}\nDestination : ${destination}\n\nLe paiement AliExpress reste à effectuer dans l'espace vendeur.`,
      `Commande boutique ${order.number} à régler chez AliExpress`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur fournisseur inconnue";
    console.error(`Shop supplier order failed for ${order.number}:`, error);
    await ShopOrder.findByIdAndUpdate(order._id, {
      $set: { "supplier.lastError": message },
      $push: { history: { at: new Date(), status: "paid", note: `Paiement client reçu; commande AliExpress à traiter manuellement : ${message}` } },
    });
    await sendAdminNotification(
      `La commande ${order.number} est payée (${order.customer.name}, ${order.customer.email}), mais la création automatique de la commande AliExpress a échoué : ${message}. Vérifie et traite cette commande manuellement.`,
      `Action requise pour la commande boutique ${order.number}`,
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!stripe) throw new Error("Stripe not initialized");

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) throw new Error("Missing Stripe signature");

    // 1. Verify the event
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    // 2. Handle the specific event type
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.shopOrderId) {
        await handleShopCheckout(session);
        return NextResponse.json({ result: event.id, ok: true });
      }
      // EXTRACT DATA
      // Stripe puts customer email in customer_details
      const userEmail = session.customer_details?.email || "";

      // 3. EXECUTE TASKS (Await them!)
      // We await these so the serverless function doesn't shut down early
      console.log(`Attempting to update booking for email: ${userEmail}`);
      await Promise.all([
        updateBookingInternal({
          email: userEmail,
          amountCents: session.amount_total ?? 0,
          currency: session.currency ?? "",
        })
          .then((r) => {
            console.log(
              `Booking updated successfully for email: ${userEmail}, result:`,
              r,
            );
            console.log(
              `Attempting to send payment success email to: ${userEmail}`,
            );
            return sendPaymentSuccessEmail(userEmail, r.data);
          })
          .then(() => {
            console.log(`Payment success email sent to: ${userEmail}`);
          }),
      ]);

      console.log("Webhook processed successfully");
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.shopOrderId;
      if (orderId) {
        await connectToMongoDB();
        await ShopOrder.findOneAndUpdate(
          { _id: orderId, stripeSessionId: session.id, status: "pending_payment" },
          {
            $set: { status: "cancelled" },
            $push: { history: { at: new Date(), status: "cancelled", note: "Session Stripe expirée sans paiement." } },
          },
        );
      }
    }

    // 4. Return 200 OK
    return NextResponse.json({ result: event.id, ok: true });
  } catch (error) {
    console.error("Webhook handling failed:", error);
    // Return 500 so Stripe knows to retry later if it was a temp error
    return NextResponse.json(
      { message: "Webhook error", error: error },
      { status: 500 },
    );
  }
}
