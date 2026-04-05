import { NextResponse } from "next/server";
import { getAllBookings, createBookingInternal } from "@/lib/booking-actions";
import { BookingDetails } from "@/types";

export async function GET() {
  try {
    const data = await getAllBookings();

    return NextResponse.json({ success: true, data: data.data });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: BookingDetails = await req.json();
    const result = await createBookingInternal(body);

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
