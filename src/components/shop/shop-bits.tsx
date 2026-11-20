import { CreditCard, MapPin, ShieldCheck, Wrench } from "lucide-react";

/** Fond "atelier" commun aux pages boutique (grille fine + halo rouge), repris de la page d'accueil. */
export function ShopBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px)",
        }}
      />
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
    </div>
  );
}

export const TRUST_ITEMS = [
  { icon: MapPin, title: "Retrait gratuit", text: "à l'atelier de Gigean" },
  { icon: Wrench, title: "Pose par nos mécaniciens", text: "sur rendez-vous" },
  { icon: ShieldCheck, title: "Garantie 2 ans", text: "retour sous 14 jours" },
  { icon: CreditCard, title: "Paiement sécurisé", text: "carte bancaire via Stripe" },
];

export function TrustStrip() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 transition hover:-translate-y-0.5 hover:border-zinc-700">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/15 text-brand-red"><Icon size={19} /></span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-white">{title}</span>
            <span className="mt-0.5 block text-xs text-zinc-400">{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
