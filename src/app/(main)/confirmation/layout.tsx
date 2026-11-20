import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  path: "/confirmation",
  title: "Confirmation de réservation - YASSAUTO",
  description: "Confirmation de votre réservation auprès de YASSAUTO MKLF.",
  noindex: true,
});

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
