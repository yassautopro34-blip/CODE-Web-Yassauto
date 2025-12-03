import { Resend } from "resend";
import BookingConfirmation from "@/components/emails/success-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentSuccessEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Payment Successful",
      react: BookingConfirmation(),
    });
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    // Don't throw here; we don't want to fail the webhook if just the email fails
    return { success: false, error };
  }
}
