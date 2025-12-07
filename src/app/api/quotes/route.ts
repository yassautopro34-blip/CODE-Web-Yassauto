import { NextResponse } from "next/server";
import { getQuotes, createQuote } from "@/lib/quote-actions";
import { MechanicQuote } from "@/types";
import { sendAdminNotification } from "@/lib/email-actions";

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

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}
