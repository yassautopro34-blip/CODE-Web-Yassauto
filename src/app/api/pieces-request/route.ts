import { NextResponse, NextRequest } from "next/server";
import { sendAdminNotification } from "@/lib/email-actions";
import { isHoneypotFilled, isRateLimited } from "@/lib/security";
import { piecesRequestSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  if (isRateLimited(request, "pieces-request")) {
    return NextResponse.json({ error: "Trop de demandes" }, { status: 429 });
  }

  try {
    // 1. Parse JSON body
    const input = await request.json();

    if (isHoneypotFilled(input.website)) {
      return NextResponse.json({ success: true }, { status: 202 });
    }

    const parsed = piecesRequestSchema.safeParse(input);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    const validatedForm = parsed.data;

    // 2. Validation - utilise les bons noms de champs du formulaire
    const form = validatedForm;

    // 3. Construire le message email
    const preferenceLabels: Record<string, string> = {
      cheapest: "🏷️ Le moins cher (neuf ou occasion)",
      new: "✨ Neuve uniquement",
      used: "♻️ Occasion en bon état",
    };

    const deliveryLabels: Record<string, string> = {
      pickup: "🏪 Retrait sur place (Gigean)",
      delivery: "🚗 Livraison à domicile",
    };

    const subject = `🔧 Nouvelle demande de pièce - ${form.fullName}`;

    const message = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ NOUVELLE DEMANDE DE PIÈCE AUTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CLIENT :
   Nom : ${form.fullName}
   📞 Téléphone : ${form.phone}
   📧 Email : ${form.email}

🚗 VÉHICULE :
   Immatriculation : ${form.licensePlate.toUpperCase()}
   ${form.carModel ? `Modèle : ${form.carModel}` : ""}
   ${form.vin ? `VIN : ${form.vin}` : ""}

🔩 PIÈCE RECHERCHÉE :
   ${form.partDescription}
   
   Préférence : ${preferenceLabels[form.preference] || form.preference}
   ${form.hasPhoto ? "📸 Le client a des photos à envoyer" : ""}

📦 LIVRAISON :
   ${deliveryLabels[form.deliveryMethod] || form.deliveryMethod}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ RAPPEL : Envoyer devis sous 24h !
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    // 4. Envoyer notification email à l'admin
    const emailResult = await sendAdminNotification(message, subject);
    if (!emailResult.success) {
      console.error("❌ Échec envoi email pièce:", emailResult.error);
    } else {
      console.log("✅ Email envoyé pour demande pièce de:", form.fullName);
    }

    // 5. Retourner succès
    return NextResponse.json({
      success: true,
      message: "Demande de pièce envoyée avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la demande de pièce:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi" },
      { status: 500 },
    );
  }
}
