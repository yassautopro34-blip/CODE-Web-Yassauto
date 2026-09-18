import { NextResponse } from "next/server";
import { getAllBookings, createBookingInternal } from "@/lib/booking-actions";
import { BookingDetails } from "@/types";
import { getAdminSession } from "@/lib/admin-session";
import { isHoneypotFilled, isRateLimited } from "@/lib/security";
import { bookingSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

export async function POST(req: NextRequest) {
  if (isRateLimited(req, "bookings")) {
    return NextResponse.json({ error: "Trop de demandes" }, { status: 429 });
  }

  try {
    const input = await req.json();
    if (isHoneypotFilled(input.website)) {
      return NextResponse.json({ success: true }, { status: 202 });
    }

    const parsed = bookingSchema.safeParse(input);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const result = await createBookingInternal(parsed.data as BookingDetails);

    return NextResponse.json({ success: result.success }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
