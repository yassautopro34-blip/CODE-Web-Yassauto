/**
 * Calcul du prix de vente boutique.
 * Règle Yassauto : marge de 150 % sur le coût complet => coefficient 2,5,
 * appliqué au prix TTC (la TVA 20 % est donc incluse dans la marge).
 * Tous les montants sont en centimes pour éviter les erreurs d'arrondi.
 */

export const VAT_RATE = 0.2;
export const DEFAULT_COEFFICIENT = 2.5;
/** Droit de douane UE forfaitaire sur les petits colis (depuis le 01/07/2026), en centimes. */
export const EU_LOW_VALUE_DUTY_CENTS = 300;
/** Estimation des frais Stripe (cartes UE standard) : 1,5 % + 0,25 €. À ajuster si besoin. */
export const STRIPE_PERCENT = 0.015;
export const STRIPE_FIXED_CENTS = 25;

export interface CostInput {
  /** Prix produit AliExpress, en centimes */
  productCents: number;
  /** Frais de livraison AliExpress vers la France, en centimes */
  shippingCents: number;
  /** Droit de douane, en centimes (3 € par défaut) */
  dutyCents?: number;
  /** Coefficient de marge (2,5 par défaut) */
  coefficient?: number;
}

export interface PriceResult {
  costCents: number;
  priceTtcCents: number;
  priceHtCents: number;
  vatCents: number;
  stripeFeeCents: number;
  netMarginCents: number;
  /** Marge nette en % du prix HT */
  netMarginRate: number;
}

/** Arrondi "psychologique" à ...,90 € au-dessus (207,50 € -> 207,90 €). */
export function roundToNinety(cents: number): number {
  const euros = Math.ceil(cents / 100);
  const candidate = euros * 100 - 10;
  return candidate >= cents ? candidate : candidate + 100;
}

export function stripeFee(priceTtcCents: number): number {
  return Math.round(priceTtcCents * STRIPE_PERCENT) + STRIPE_FIXED_CENTS;
}

/** Détail de marge pour un prix TTC donné (utile quand le prix est saisi à la main). */
export function breakdown(priceTtcCents: number, costCents: number): PriceResult {
  const priceHtCents = Math.round(priceTtcCents / (1 + VAT_RATE));
  const vatCents = priceTtcCents - priceHtCents;
  const fee = stripeFee(priceTtcCents);
  const netMarginCents = priceHtCents - costCents - fee;
  return {
    costCents,
    priceTtcCents,
    priceHtCents,
    vatCents,
    stripeFeeCents: fee,
    netMarginCents,
    netMarginRate: priceHtCents > 0 ? netMarginCents / priceHtCents : 0,
  };
}

/** Prix de vente conseillé à partir du coût fournisseur. */
export function computePrice(input: CostInput): PriceResult {
  const duty = input.dutyCents ?? EU_LOW_VALUE_DUTY_CENTS;
  const k = input.coefficient ?? DEFAULT_COEFFICIENT;
  const costCents = input.productCents + input.shippingCents + duty;
  const priceTtcCents = roundToNinety(Math.round(costCents * k));
  return breakdown(priceTtcCents, costCents);
}

export const formatEuros = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
