import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { getAllBookings } from "@/lib/booking-actions";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
    })
  : null;

async function readBookings() {
  const data = await getAllBookings();
  return data.data;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Get Query Params in Next.js 14
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id query parameter" },
        { status: 400 },
      );
    }

    // 3. Check Stripe Configuration
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured on server" },
        { status: 500 },
      );
    }

    // 4. Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    // 5. Retrieve associated booking from DB
    let booking = null;
    if (session && session.metadata && session.metadata.bookingId) {
      const bookings = await readBookings();
      booking =
        bookings.find(
          (b) => b._id.toString() === session.metadata?.bookingId,
        ) || null;
    }

    // 6. Return Data
    return NextResponse.json({ success: true, session, booking });
  } catch (err) {
    console.error("Error fetching stripe session", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Erreur serveur lors de la récupération de la session Stripe",
        details: msg,
      },
      { status: 500 },
    );
  }
}
