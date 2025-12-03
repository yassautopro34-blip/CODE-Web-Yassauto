import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
    })
  : null;

// Placeholder: Import your actual DB logic here
// import { getReservations } from '@/lib/db';
function readBookings() {
  // TODO: Replace with your actual database fetch (Prisma, MongoDB, JSON file read, etc.)
  // Returning an empty array to prevent TS errors in this snippet
  return [] as any[];
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

    // 2. Handle Fake Sessions (Local Testing)
    if (sessionId.startsWith("fake-")) {
      const bookingId = sessionId.replace("fake-", "");
      const bookings = readBookings();

      // Find booking in DB
      const booking =
        bookings.find((b) => b.id === bookingId) || null;

      // Construct mock response
      return NextResponse.json({
        success: true,
        session: {
          id: sessionId,
          payment_status:
            booking && booking.status === "confirmed"
              ? "paid"
              : "unpaid",
          customer_details: { email: booking?.form?.clientEmail || null },
          metadata: {
            bookingId: bookingId,
            isStudent: booking?.form?.isStudent ? "1" : "0",
          },
        },
        booking,
      });
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
      const bookings = readBookings();
      booking =
        bookings.find((b) => b.id === session.metadata?.bookingId) ||
        null;
    }

    // 6. Return Data
    return NextResponse.json({ success: true, session, booking });
  } catch (err: any) {
    console.error("Error fetching stripe session", err);
    return NextResponse.json(
      {
        error: "Erreur serveur lors de la récupération de la session Stripe",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
