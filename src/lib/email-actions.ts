"use server"
import { Resend } from "resend";
import BookingConfirmation from "../../emails/success-email";
import { IBookingDocument } from "@/lib/models/booking";
import AdminEmail from "../../emails/admin-email";
import type { IShopOrder } from "@/lib/models/shop-order";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentSuccessEmail(
  email: string,
  data: IBookingDocument | null,
) {
  try {
    await resend.emails.send({
      from: "Yassauto <hello@support.yassauto.fr>",
      to: email,
      subject: "Payment Successful",
      react: BookingConfirmation({
        bookingDateTime: data?.bookingDate,
        bookingType: data?.bookingType,
        clientName: data?.clientName,
        clientPhone: data?.clientPhone,
        depositCents: data?.amount_cents,
        totalCents: data?.isStudent ? 10000 : 15000,
        isStudentFlag: data?.isStudent,
      }),
    });
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    // Don't throw here; we don't want to fail the webhook if just the email fails
    return { success: false, error };
  }
}
export async function sendAdminNotification(message: string, subject: string) {
  try {
    await resend.emails.send({
      from: "Yassauto <hello@support.yassauto.fr>",
      to: process.env.ADMIN_EMAIL ?? "Yassauto",
      subject: `New Admin Notification, ${subject}`,
      react: AdminEmail({ message, subject }),
    });
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    // Don't throw here; we don't want to fail the webhook if just the email fails
    return { success: false, error };
  }
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[char] ?? char);

const formatEuros = (cents: number) => (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

export async function sendShopOrderConfirmationEmail(order: IShopOrder) {
  const lines = order.lines.map((line) => {
    const unitTotal = line.unitPriceTtcCents + (line.installPriceTtcCents ?? 0);
    return `<li style="margin:0 0 12px"><strong>${escapeHtml(line.title)}</strong><br>${escapeHtml(line.variantLabel)} × ${line.quantity} — ${formatEuros(unitTotal * line.quantity)}</li>`;
  }).join("");
  const delivery = order.delivery.mode === "home" ? "Livraison à domicile" : "Retrait à l'atelier de Gigean";

  try {
    await resend.emails.send({
      from: "Yassauto <hello@support.yassauto.fr>",
      to: order.customer.email,
      subject: `Commande ${order.number} confirmée — YASSAUTO`,
      html: `<div style="background:#09090b;color:#f4f4f5;font-family:Arial,sans-serif;padding:32px;max-width:600px;margin:auto"><p style="color:#ef4444;font-weight:bold;letter-spacing:1px">YASSAUTO · BOUTIQUE</p><h1 style="font-size:28px">Merci ${escapeHtml(order.customer.name)}.</h1><p>Ton paiement est confirmé. Nous préparons la commande <strong>${escapeHtml(order.number)}</strong>.</p><h2 style="font-size:17px;margin-top:28px">Récapitulatif</h2><ul style="padding-left:20px;color:#d4d4d8">${lines}</ul><p style="border-top:1px solid #3f3f46;padding-top:16px;font-size:20px;font-weight:bold">Total TTC : ${formatEuros(order.totalTtcCents)}</p><p style="color:#a1a1aa">${delivery}. Tu recevras une nouvelle information dès que la commande évolue.</p><p style="color:#71717a;font-size:12px;margin-top:32px">Une question ? Réponds à cet email ou appelle le 06 48 38 05 68.</p></div>`,
    });
    return { success: true };
  } catch (error) {
    console.error("Shop order confirmation email error:", error);
    return { success: false, error };
  }
}
