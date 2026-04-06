import { NextResponse, NextRequest } from "next/server";
import { sendAdminNotification } from "@/lib/email-actions";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON body
    const form = await request.json();

    // 2. Validation - utilise les bons noms de champs du formulaire
    if (!form.fullName || !form.phone || !form.email || !form.licensePlate || !form.partDescription) {
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
