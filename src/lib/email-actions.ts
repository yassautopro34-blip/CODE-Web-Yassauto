import { Resend } from "resend";
import BookingConfirmation from "../../emails/success-email";
import { IBookingDocument } from "@/lib/models/booking";
import AdminEmail from "../../emails/admin-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentSuccessEmail(
  email: string,
  data: IBookingDocument | null,
) {
  try {
    await resend.emails.send({
      from: "Yassauto <hello@yassauto.fr>",
      to: [email],
      subject: "Payment Successful",
      react: BookingConfirmation({
        bookingDateTime: data?.bookingDate,
        bookingType: data?.bookingType,
        clientName: data?.clientName,
        clientPhone: data?.clientPhone,
        depositCents: data?.amount_cents,
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
      from: "Yassauto <hello@yassauto.fr>",
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
