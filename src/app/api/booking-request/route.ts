import { NextResponse, NextRequest } from "next/server";
import { createBookingInternal } from "@/lib/booking-actions";
import { sendAdminNotification } from "@/lib/email-actions";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON body
    const form = await request.json();

    // 2. Validation
    if (!form.clientName || !form.clientPhone || !form.date || !form.clientEmail) {
      return NextResponse.json(
        {
          error: "Champs manquants : clientName, clientPhone, clientEmail, date requis",
        },
        { status: 400 },
      );
    }

    // 3. Sauvegarder la demande en base de données
    const booking = await createBookingInternal({
      ...form,
      bookingDate: form.date,
      status: "pending",
    });

    // 4. Envoyer une notification email à l'admin
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    const subject = `🚗 Nouvelle demande d'accompagnement : ${form.clientName}`;

    const message = `
      ⚡ NOUVELLE DEMANDE D'ACCOMPAGNEMENT ACHAT ⚡
      
      👤 CLIENT :
      - Nom : ${form.clientName}
      - Téléphone : ${form.clientPhone}
      - Email : ${form.clientEmail}
      - Étudiant : ${form.isStudent ? "✅ Oui (-30%)" : "Non"}

      📅 CRÉNEAU SOUHAITÉ :
      - Date : ${formatDate(form.date)}
      - Heure : ${form.timeSlot}
      - Lieu : ${form.address || "Non spécifié"}

      🚗 VÉHICULE :
      - Modèle : ${form.carModel || "N/A"}
      - Lien annonce : ${form.postLink || "N/A"}
      - Documents : ${form.hasDocs ? "✅ Oui" : "Non"}

      💰 TARIF : ${form.isStudent ? "100€ (tarif étudiant)" : "150€"}

      ⏰ RAPPEL : Confirmez et envoyez le lien de paiement sous 60 minutes !

      ---
      📱 Appeler le client : ${form.clientPhone}
      📧 Email : ${form.clientEmail}
    `;

    try {
      await sendAdminNotification(message, subject);
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // On continue même si l'email échoue
    }

    // 5. Retourner succès
    return NextResponse.json({
      success: true,
      message: "Demande envoyée avec succès",
      bookingId: booking?._id?.toString() || null,
    });
  } catch (error) {
    console.error("Booking request error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi de la demande" },
      { status: 500 },
    );
  }
}
