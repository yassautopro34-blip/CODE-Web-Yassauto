import { NextResponse } from "next/server";
import { getQuotes, createQuote } from "@/lib/quote-actions";
import { MechanicQuote } from "@/types";

export async function GET() {
  try {
    const result = await getQuotes();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: MechanicQuote = await req.json();
    const result = await createQuote(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}
