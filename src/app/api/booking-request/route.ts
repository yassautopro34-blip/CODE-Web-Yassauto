import { NextResponse, NextRequest } from "next/server";
import { createBookingInternal } from "@/lib/booking-actions";
import { sendAdminNotification } from "@/lib/email-actions";
import { isHoneypotFilled, isRateLimited } from "@/lib/security";
import { bookingRequestSchema } from "@/lib/validation";
import { BookingDetails } from "@/types";

export async function POST(request: NextRequest) {
  if (isRateLimited(request, "booking-request")) {
    return NextResponse.json({ error: "Trop de demandes" }, { status: 429 });
  }

  try {
    // 1. Parse JSON body
    const input = await request.json();

    if (isHoneypotFilled(input.website)) {
      return NextResponse.json({ success: true }, { status: 202 });
    }

    const parsed = bookingRequestSchema.safeParse(input);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    const validatedForm = parsed.data;

    // 2. Validation
    const form = validatedForm;

    // 3. Sauvegarder la demande en base de données
    await createBookingInternal({
      clientName: form.clientName,
      clientPhone: form.clientPhone,
      clientEmail: form.clientEmail,
      date: form.date,
      timeSlot: form.timeSlot,
      address: form.address,
      carModel: form.carModel,
      postLink: form.postLink,
      hasDocs: form.hasDocs,
      isStudent: form.isStudent,
      bookingDate: form.date,
      status: "pending",
      description: `Véhicule: ${form.carModel} | Ville: ${form.address} | Annonce: ${form.postLink}`,
      amount_cents: 0,
      currency: "eur",
      bookingType: "accompagnement",
      confirmedAt: "",
    } satisfies BookingDetails);

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
    });
  } catch (error) {
    console.error("Booking request error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi de la demande" },
      { status: 500 },
    );
  }
}
