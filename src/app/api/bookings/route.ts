import { NextResponse } from "next/server";
import { getAllBookings } from "@/lib/booking-actions";

export async function GET() {
  try {
    const data = await getAllBookings();

    return NextResponse.json({ success: true, data: data.data });
  } catch (err) {
    return NextResponse.json(
      {
        error: err,
      },
      { status: 500 },
    );
  }
}
