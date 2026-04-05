import { NextResponse, NextRequest } from "next/server";
import { sendAdminNotification } from "@/lib/email-actions";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON body
    const form = await request.json();

    // 2. Validation
    if (!form.name || !form.phone || !form.email || !form.licensePlate || !form.partDescription) {
      return NextResponse.json(
        {
          error: "Champs manquants : nom, téléphone, email, immatriculation et description requis",
        },
        { status: 400 },
      );
    }

    // 3. Construire le message email
    const preferenceLabels: Record<string, string> = {
      cheapest: "🏷️ Le moins cher (neuf ou occasion)",
      new: "✨ Neuve uniquement",
      used: "♻️ Occasion en bon état",
    };

    const deliveryLabels: Record<string, string> = {
      pickup: "🏪 Retrait sur place (Montpellier)",
      local: "🚗 Livraison locale (Montpellier et alentours)",
      france: "📦 Envoi partout en France",
    };

    const subject = `🔧 Nouvelle demande de pièce auto : ${form.name}`;

    const message = `
      ⚡ NOUVELLE DEMANDE DE PIÈCE AUTO ⚡
      
      👤 CLIENT :
      - Nom : ${form.name}
      - Téléphone : ${form.phone}
      - Email : ${form.email}

      🚗 VÉHICULE :
      - Immatriculation : ${form.licensePlate}
      ${form.vehicleDetails ? `- Infos complémentaires : ${form.vehicleDetails}` : ""}

      🔩 PIÈCE RECHERCHÉE :
      - Description : ${form.partDescription}
      - Préférence : ${preferenceLabels[form.partPreference] || form.partPreference}

      📦 LIVRAISON :
      - Mode : ${deliveryLabels[form.deliveryMethod] || form.deliveryMethod}
      ${form.deliveryAddress ? `- Adresse : ${form.deliveryAddress}` : ""}

      ${form.comments ? `📝 COMMENTAIRES :\n${form.comments}` : ""}

      ---
      📱 Appeler le client : ${form.phone}
      📧 Email : ${form.email}
      
      ⏰ Envoyer un devis sous 24h !
    `;

    // 4. Envoyer notification email à l'admin
    try {
      await sendAdminNotification(message, subject);
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // On continue même si l'email échoue
    }

    // 5. Retourner succès
    return NextResponse.json({
      success: true,
      message: "Demande de pièce envoyée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande de pièce:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 },
    );
  }
}
