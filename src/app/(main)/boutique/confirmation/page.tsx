import Link from "next/link";
import type { Metadata } from "next";
import Stripe from "stripe";
import { ArrowRight, CheckCircle2, Clock3, ShieldAlert } from "lucide-react";
import { connectToMongoDB } from "@/lib/db";
import ShopOrder from "@/lib/models/shop-order";
import { ShopBackdrop } from "@/components/shop/shop-bits";
import { ClearCartAfterPayment } from "@/components/shop/clear-cart-after-payment";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirmation de commande - YASSAUTO",
  robots: { index: false, follow: false },
};

type Search = Promise<{ session_id?: string }>;

export default async function ShopConfirmationPage({ searchParams }: { searchParams: Search }) {
  const { session_id: sessionId } = await searchParams;
  let view: "invalid" | "pending" | "paid" | "supplier_pending" | "supplier_error" = "invalid";
  let orderNumber = "";

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" });
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const orderId = session.metadata?.shopOrderId;
      if (orderId && session.payment_status === "paid") {
        await connectToMongoDB();
        const order = await ShopOrder.findOne({ _id: orderId, stripeSessionId: session.id })
          .select("number status supplier.lastError")
          .lean();
        if (order) {
          orderNumber = order.number;
          if (order.supplier?.lastError) view = "supplier_error";
          else if (order.status === "sent_to_supplier" || order.status === "supplier_paid" || order.status === "shipped" || order.status === "delivered") view = "supplier_pending";
          else view = "paid";
        } else {
          view = "pending";
        }
      } else if (orderId) {
        view = "pending";
      }
    } catch (error) {
      console.error("Shop order confirmation lookup failed:", error);
      view = "pending";
    }
  }

  const content = {
    invalid: {
      icon: ShieldAlert,
      title: "Confirmation indisponible",
      text: "Cette page ne contient pas de confirmation de paiement vérifiable.",
      tone: "text-zinc-300",
    },
    pending: {
      icon: Clock3,
      title: "Paiement en cours de vérification",
      text: "Nous vérifions le paiement et la préparation de ta commande. Garde ton email de confirmation.",
      tone: "text-amber-300",
    },
    paid: {
      icon: CheckCircle2,
      title: "Paiement confirmé",
      text: "Ta commande est enregistrée et passe en préparation. Tu recevras un email dès son expédition.",
      tone: "text-emerald-300",
    },
    supplier_pending: {
      icon: CheckCircle2,
      title: "Commande confirmée",
      text: "Ton paiement est confirmé et ta commande est en préparation. Tu recevras un email dès son expédition.",
      tone: "text-emerald-300",
    },
    supplier_error: {
      icon: Clock3,
      title: "Paiement confirmé, préparation en cours",
      text: "Ta commande est payée et en cours de préparation. Nous te tiendrons informé par email.",
      tone: "text-amber-300",
    },
  }[view];
  const Icon = content.icon;
  const paymentConfirmed = view === "paid" || view === "supplier_pending" || view === "supplier_error";

  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-brand-black text-white">
      <ShopBackdrop />
      <main className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6">
        {paymentConfirmed && <ClearCartAfterPayment />}
        <span className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 ${content.tone}`}><Icon size={30} /></span>
        <p className="text-xs font-bold uppercase tracking-wide text-brand-red">Boutique YassAuto</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">{content.title}</h1>
        {orderNumber && <p className="mt-3 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-200">Commande {orderNumber}</p>}
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400 md:text-base">{content.text}</p>
        <Link href="/boutique" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-3 font-bold text-white transition hover:bg-red-600">
          Retour à la boutique <ArrowRight size={17} />
        </Link>
      </main>
    </div>
  );
}