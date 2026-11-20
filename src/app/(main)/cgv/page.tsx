import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: "/cgv",
    title: "Conditions générales de vente - Boutique YASSAUTO",
    description: "Conditions générales de vente de la boutique en ligne YASSAUTO.",
  }),
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3 text-sm leading-7 text-zinc-700">
    <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
    {children}
  </section>
);

export default function CgvPage() {
  return (
    <article className="min-h-screen bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <header>
          <h1 className="text-3xl font-black text-zinc-900">Conditions générales de vente</h1>
          <p className="mt-2 text-sm text-zinc-500">Boutique YASSAUTO · Dernière mise à jour : 1er octobre 2026</p>
        </header>

        <Section title="1. Vendeur">
          <p>La boutique est exploitée par <strong>YASSAUTO MKLF</strong>, SARL au capital de 1 000 €, immatriculée au RCS de Montpellier sous le numéro 101 781 854.</p>
          <p>Siège social : 7 rue André Marie Ampère, 34770 Gigean, France. Email : yassauto.pro34@gmail.com. Téléphone : 06 48 38 05 68.</p>
        </Section>

        <Section title="2. Produits et compatibilité">
          <p>Les produits, variantes, photos, prix et informations de compatibilité sont présentés avec le plus grand soin. Les photographies sont illustratives et peuvent présenter de légères différences.</p>
          <p>Pour les équipements automobiles, le client doit vérifier la marque, le modèle, l’année et, lorsque cela est indiqué, le système d’origine ou la variante choisie. En cas de doute, il est recommandé de contacter YASSAUTO avant la commande.</p>
          <p>Les produits universels sont présentés comme tels. Leur compatibilité dépend toutefois de l’installation et des caractéristiques du véhicule.</p>
        </Section>

        <Section title="3. Prix">
          <p>Les prix sont affichés en euros TTC. Les frais et conditions de livraison sont indiqués avant le paiement. Les prix peuvent être modifiés avant la commande, mais le prix validé lors du paiement est celui applicable à la commande.</p>
        </Section>

        <Section title="4. Commande">
          <p>Le client sélectionne ses produits, renseigne ses coordonnées et son mode de livraison, puis vérifie le récapitulatif avant paiement. La commande devient définitive après confirmation du paiement par Stripe.</p>
          <p>Un email de confirmation est envoyé à l’adresse renseignée. YASSAUTO peut refuser ou annuler une commande en cas d’indisponibilité, d’erreur manifeste de prix, de fraude présumée ou d’impossibilité technique, avec remboursement du paiement concerné.</p>
        </Section>

        <Section title="5. Paiement">
          <p>Le paiement est réalisé par carte bancaire via Stripe. YASSAUTO ne reçoit pas les données complètes de carte bancaire. Le paiement est débité au moment de la commande.</p>
        </Section>

        <Section title="6. Livraison et dropshipping">
          <p>Selon le produit et le mode choisi, la commande peut être expédiée directement par un fournisseur partenaire, notamment AliExpress, vers l’adresse indiquée par le client, ou vers l’atelier YASSAUTO pour un retrait ou une pose.</p>
          <p>Les délais affichés sont indicatifs. Un retard lié au transport, au fournisseur ou aux formalités douanières ne permet pas au client de modifier l’adresse après expédition. YASSAUTO informe le client lorsqu’une difficulté importante est connue.</p>
          <p>Le client doit fournir une adresse complète et accessible. Les colis retournés pour adresse erronée ou absence répétée peuvent entraîner des frais de réexpédition.</p>
        </Section>

        <Section title="7. Retrait et pose à Gigean">
          <p>Lorsque le client choisit le retrait ou la pose à l’atelier, il est prévenu lorsque le colis est arrivé. La pose est une prestation distincte, proposée uniquement lorsque la fiche produit le prévoit. Le rendez-vous est fixé après réception du produit.</p>
        </Section>

        <Section title="8. Droit de rétractation et retours">
          <p>Le consommateur dispose en principe d’un délai de quatorze jours à compter de la réception pour exercer son droit de rétractation, sans avoir à justifier sa décision. Les modalités sont détaillées sur la page <Link className="font-semibold text-brand-red underline" href="/livraison-retours">Livraison et retours</Link>.</p>
          <p>Le droit de rétractation peut notamment être exclu pour un produit confectionné ou personnalisé selon les spécifications du client, ou pour une prestation de service pleinement exécutée avant la fin du délai avec demande expresse du client et renoncement exprès à son droit de rétractation. Ces exceptions sont confirmées au cas par cas avant exécution.</p>
        </Section>

        <Section title="9. Garanties légales">
          <p>Les produits bénéficient de la garantie légale de conformité et de la garantie légale des vices cachés dans les conditions prévues par la loi. Le client doit contacter YASSAUTO dès qu’un défaut ou une non-conformité est constaté, avec le numéro de commande et des photographies si nécessaire.</p>
        </Section>

        <Section title="10. Responsabilité et force majeure">
          <p>YASSAUTO ne peut être tenue responsable d’un événement imprévisible et irrésistible, d’une panne d’un service de paiement, d’un retard de transport ou d’un événement relevant du fournisseur, sous réserve des obligations légales applicables au vendeur.</p>
        </Section>

        <Section title="11. Droit applicable et médiation">
          <p>Les présentes conditions sont soumises au droit français. Le client consommateur peut recourir gratuitement à un médiateur de la consommation après réclamation écrite préalable. YASSAUTO adhère au CM2C (Centre de la Médiation de la Consommation de Conciliateurs de Justice), 49 rue de Ponthieu, 75008 Paris, saisine en ligne sur www.cm2c.net. Le détail de la procédure figure sur la page Livraison, retours et garanties.</p>
        </Section>

        <Section title="12. Contact">
          <p>Pour toute question sur une commande : yassauto.pro34@gmail.com ou 06 48 38 05 68.</p>
        </Section>
      </div>
    </article>
  );
}
