import { callMethod } from "./client";
import type { IShopOrder } from "@/lib/models/shop-order";

/** Adresse de l'atelier, utilisée pour le mode "retrait atelier". */
export const WORKSHOP_ADDRESS = {
  line1: "7 rue André Marie Ampère",
  zip: "34770",
  city: "Gigean",
  province: "Herault",
  phone: "+33648380568",
} as const;

/** Téléphone au format attendu par AliExpress : indicatif séparé du numéro. */
function splitPhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+33")) return { phone_country: "+33", mobile_no: "0" + digits.slice(3) };
  if (digits.startsWith("0033")) return { phone_country: "+33", mobile_no: "0" + digits.slice(4) };
  return { phone_country: "+33", mobile_no: digits };
}

/**
 * Construit la demande de commande AliExpress à partir de la commande client.
 * L'adresse saisie sur le site est reprise telle quelle ; en retrait atelier,
 * on envoie à l'atelier avec le nom du client (pour reconnaître le colis).
 */
export function buildPlaceOrderRequest(order: IShopOrder) {
  const pickup = order.delivery.mode === "workshop_pickup" || order.delivery.mode === "workshop_install";
  const a = order.shippingAddress;
  const address = pickup
    ? {
        address: WORKSHOP_ADDRESS.line1,
        address2: `Retrait client ${order.number}`,
        city: WORKSHOP_ADDRESS.city,
        province: WORKSHOP_ADDRESS.province,
        zip: WORKSHOP_ADDRESS.zip,
        ...splitPhone(WORKSHOP_ADDRESS.phone),
      }
    : {
        address: a.line1,
        address2: a.line2 ?? "",
        city: a.city,
        province: a.province ?? a.city,
        zip: a.zip,
        ...splitPhone(a.phone),
      };

  return {
    out_order_id: order.number,
    logistics_address: {
      ...address,
      country: "FR",
      full_name: pickup ? `${a.fullName} c/o Yassauto` : a.fullName,
      contact_person: a.fullName,
      locale: "fr_FR",
    },
    product_items: order.lines.map((l) => ({
      product_id: Number(l.aeProductId),
      product_count: l.quantity,
      sku_attr: l.aeSkuAttr ?? "",
      logistics_service_name: l.logisticsServiceName ?? "",
      order_memo: `Commande ${order.number} - merci de ne pas joindre de facture`,
    })),
  };
}

/**
 * Crée la commande chez AliExpress (statut "en attente de paiement" côté AliExpress).
 * Déclenché uniquement par le bouton "Envoyer au fournisseur" de l'admin.
 */
export async function placeSupplierOrder(order: IShopOrder, accessToken: string) {
  const request = buildPlaceOrderRequest(order);
  const res = await callMethod<Record<string, unknown>>("aliexpress.ds.order.create", accessToken, {
    param_place_order_request4_open_api_d_t_o: request,
    ds_extend_request: { payment: { pay_currency: "EUR" } },
  });
  const result = (res as { aliexpress_ds_order_create_response?: { result?: { order_list?: { number: number[] }; is_success?: boolean; error_code?: string } } })
    .aliexpress_ds_order_create_response?.result;
  if (!result?.is_success) {
    throw new Error(`Commande AliExpress refusée : ${result?.error_code ?? "raison inconnue"}`);
  }
  return (result.order_list?.number ?? []).map(String);
}
