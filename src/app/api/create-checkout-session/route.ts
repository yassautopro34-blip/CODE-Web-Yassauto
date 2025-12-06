import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { createBookingInternal } from "@/lib/booking-actions";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
    })
  : null;

const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON body in Next.js 14
    const form = await request.json();

    // 2. Minimal Validation
    if (
      !form.clientName ||
      !form.clientPhone ||
      !form.bookingDate ||
      !form.clientEmail
    ) {
      return NextResponse.json(
        {
          error:
            "Champs manquants : clientName, clientPhone, clientEmail, bookingDate requis",
        },
        { status: 400 },
      );
    }

    // 3. Create unique ID
    const bookingId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // 4. Determine price
    const isStudent = !!form.isStudent;

    if (!stripe) {
      throw new Error("Stripe server returned");
    }
    const res = await createBookingInternal({
      ...form,
      status: "pending",
    });

    // 7. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: form.clientEmail,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Acompte réservation YassAuto" },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: res.data._id.toString() ?? "failed",
        isStudent: isStudent ? "1" : "0",
      },
      // Keeping your HashRouter syntax
      success_url: `${frontendBase}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendBase}/annulation`,
    });

    // 8. Return Success
    return NextResponse.json({ url: session.url, bookingId });
  } catch (err) {
    console.error("Error creating checkout session", err);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 },
    );
  }
}
