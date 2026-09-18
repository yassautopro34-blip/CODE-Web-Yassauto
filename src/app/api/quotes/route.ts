import { NextResponse } from "next/server";
import { getQuotes, createQuote } from "@/lib/quote-actions";
import { MechanicQuote } from "@/types";
import { sendAdminNotification } from "@/lib/email-actions";
import { getAdminSession } from "@/lib/admin-session";
import { isHoneypotFilled, isRateLimited } from "@/lib/security";
import { mechanicQuoteSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await getQuotes();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (isRateLimited(req, "quotes")) {
    return NextResponse.json({ error: "Trop de demandes" }, { status: 429 });
  }

  try {
    const input = await req.json();
    if (isHoneypotFilled(input.website)) {
      return NextResponse.json({ success: true }, { status: 202 });
    }

    const parsed = mechanicQuoteSchema.safeParse(input);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const body = parsed.data as MechanicQuote;
    const result = await createQuote(body);

    // Send notification asynchronously
    const requestTypeLabel =
      body.requestType === "repair" ? "Réparation" : "Diagnostic";
    
    const subject = `Nouvelle Demande de Devis : ${body.firstName} ${body.lastName}`;
    
    const message = `
      Nouvelle demande reçue de la part de ${body.firstName} ${body.lastName}.
      
      📋 Détails du Client :
      - Téléphone : ${body.phone}
      - Email : ${body.email || "Non renseigné"}
      
      🚗 Véhicule :
      - Immatriculation : ${body.licensePlate}
      
      🔧 Demande :
      - Type : ${requestTypeLabel}
      - Description : ${body.issueDescription}
      - Photos disponibles : ${body.hasPhotos ? "Oui" : "Non"}
      
      Veuillez traiter cette demande dans les plus brefs délais.
    `;

    // We don't await this to avoid blocking the response, or we catch errors to ensure the API still succeeds
    try {
      await sendAdminNotification(message, subject);
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
    }

    return NextResponse.json({ success: result.success }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}
