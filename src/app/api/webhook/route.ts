import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendPaymentSuccessEmail } from "@/lib/email-actions";
import { updateBookingInternal } from "@/lib/booking-actions";

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover", // Use the latest API version you are on
    })
  : null;

export async function POST(req: Request) {
  try {
    if (!stripe) throw new Error("Stripe not initialized");

    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) throw new Error("Missing Stripe signature");

    // 1. Verify the event
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    // 2. Handle the specific event type
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      // EXTRACT DATA
      // Stripe puts customer email in customer_details
      const userEmail = session.customer_details?.email || "";

      // 3. EXECUTE TASKS (Await them!)
      // We await these so the serverless function doesn't shut down early
      console.log(`Attempting to update booking for email: ${userEmail}`);
      await Promise.all([
        updateBookingInternal({
          email: userEmail,
          status: "paid",
        })
          .then((r) => {
            console.log(
              `Booking updated successfully for email: ${userEmail}, result:`,
              r,
            );
            console.log(
              `Attempting to send payment success email to: ${userEmail}`,
            );
            return sendPaymentSuccessEmail(userEmail, r.username ?? "");
          })
          .then(() => {
            console.log(`Payment success email sent to: ${userEmail}`);
          }),
      ]);

      console.log("Webhook processed successfully");
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
