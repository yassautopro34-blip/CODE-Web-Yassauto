"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Eye, EyeOff, Link2, Loader2, PenLine, Plus, Trash2 } from "lucide-react";
import { breakdown, formatEuros } from "@/lib/shop/pricing";
import { slugify } from "@/lib/shop/product-schema";

type Category = "carplay" | "led" | "ciel-etoile" | "accessoire";
type Status = "draft" | "published" | "unavailable";

interface Variant {
  sku: string;
  label: string;
  aeSkuAttr: string;
  priceTtcCents: number;
  costCents: number;
  available: boolean;
}

interface Fitment {
  brand: string;
  model: string;
  yearFrom?: number;
  yearTo?: number;
}

interface ProductForm {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: Category;
  status: Status;
  images: string[];
  videoUrl: string;
  variants: Variant[];
  universal: boolean;
  fitments: Fitment[];
  installOffer: { enabled: boolean; priceTtcCents: number; durationMin: number };
  supplier: {
    platform: "aliexpress";
    productId: string;
    url: string;
    logisticsServiceName?: string;
    deliveryDaysMin?: number;
    deliveryDaysMax?: number;
  };
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "carplay", label: "Écrans CarPlay / Android Auto" },
  { value: "led", label: "Bandes LED intérieures" },
  { value: "ciel-etoile", label: "Ciel étoilé" },
  { value: "accessoire", label: "Accessoires" },
];

const STATUS_LABEL: Record<Status, string> = {
  draft: "Brouillon",
  published: "En ligne",
  unavailable: "Indisponible",
};

const emptyForm = (): ProductForm => ({
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  category: "carplay",
  status: "draft",
  images: [],
  videoUrl: "",
  variants: [{ sku: "v1", label: "Standard", aeSkuAttr: "", priceTtcCents: 0, costCents: 0, available: true }],
  universal: false,
  fitments: [],
  installOffer: { enabled: false, priceTtcCents: 0, durationMin: 60 },
  supplier: { platform: "aliexpress", productId: "", url: "" },
});

const euroInput = (cents: number) => (cents / 100).toFixed(2);
const toCents = (v: string) => Math.round(parseFloat(v.replace(",", ".") || "0") * 100);

const input = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black";
const btn = "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50";

// ---------------------------------------------------------------------------

function ConnectionCard() {
  const [status, setStatus] = useState<{ connected: boolean; accountName?: string; refreshExpiresAt?: string } | null>(null);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const st = q.get("aliexpress");
    if (st) {
      setFlash({
        ok: st === "ok",
        text: st === "ok" ? "Compte AliExpress connecté." : `Connexion échouée : ${q.get("detail") ?? st}`,
      });
      window.history.replaceState(null, "", "/admin/boutique");
    }
    fetch("/api/shop/admin/aliexpress/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ connected: false }));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-semibold">Connexion AliExpress</p>
        <p className="text-sm text-gray-500">
          {status === null
            ? "Vérification…"
            : status.connected
              ? `Connecté${status.accountName ? ` (${status.accountName})` : ""} · valable jusqu'au ${new Date(status.refreshExpiresAt ?? "").toLocaleDateString("fr-FR")}`
              : "Non connecté : l'import automatique est désactivé, la saisie manuelle reste possible."}
        </p>
        {flash && <p className={`text-sm mt-1 ${flash.ok ? "text-green-700" : "text-red-600"}`}>{flash.text}</p>}
      </div>
      <a href="/api/shop/aliexpress/connect" className={`${btn} bg-orange-500 hover:bg-orange-600 text-white`}>
        <Link2 size={16} /> {status?.connected ? "Reconnecter" : "Connecter mon compte"}
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ImportBox({ onReady }: { onReady: (f: ProductForm) => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runImport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/shop/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import impossible");
      const sel = data.delivery?.selected;
      onReady({
        ...emptyForm(),
        title: data.title,
        slug: slugify(data.title),
        description: data.descriptionHtml ?? "",
        images: data.images ?? [],
        variants: (data.variants ?? []).map((v: { aeSkuId: string; aeSkuAttr: string; label: string; stock: number; pricing: { priceTtcCents: number; costCents: number } }, i: number) => ({
          sku: v.aeSkuId || `v${i + 1}`,
          label: v.label,
          aeSkuAttr: v.aeSkuAttr,
          priceTtcCents: v.pricing.priceTtcCents,
          costCents: v.pricing.costCents,
          available: v.stock > 0,
        })),
        supplier: {
          platform: "aliexpress",
          productId: data.productId,
          url: data.url,
          logisticsServiceName: sel?.code,
          deliveryDaysMin: sel?.minDays,
          deliveryDaysMax: sel?.maxDays,
        },
      });
      setUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <p className="font-semibold">Ajouter un produit</p>
      <div className="flex flex-wrap gap-2">
        <input
          className={`${input} flex-1 min-w-[260px]`}
          placeholder="Colle l'URL du produit AliExpress (…/item/1005….html)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={runImport} disabled={loading || url.length < 8} className={`${btn} bg-black text-white hover:bg-gray-800`}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Importer
        </button>
        <button onClick={() => onReady(emptyForm())} className={`${btn} border border-gray-300 hover:bg-gray-100`}>
          <PenLine size={16} /> Saisie manuelle
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

function ProductEditor({ initial, onClose, onSaved }: { initial: ProductForm; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<ProductForm>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof ProductForm>(k: K, v: ProductForm[K]) => setF((p) => ({ ...p, [k]: v }));
  const setVariant = (i: number, patch: Partial<Variant>) =>
    set("variants", f.variants.map((v, j) => (j === i ? { ...v, ...patch } : v)));
  const setFitment = (i: number, patch: Partial<Fitment>) =>
    set("fitments", f.fitments.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  const save = async (status: Status) => {
    setSaving(true);
    setError("");
    const body = { ...f, status, videoUrl: f.videoUrl || undefined };
    delete (body as { _id?: string })._id;
    try {
      const res = await fetch(f._id ? `/api/shop/admin/products/${f._id}` : "/api/shop/admin/products", {
        method: f._id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const detail = data.issues?.map((i: { path: string[]; message: string }) => `${i.path.join(".")} : ${i.message}`).join(" · ");
        throw new Error(detail ? `${data.error} — ${detail}` : data.error);
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{f._id ? "Modifier le produit" : "Nouveau produit"}</h2>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-black">Fermer</button>
      </div>

      {/* Infos */}
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Titre">
          <input className={input} value={f.title} onChange={(e) => setF((p) => ({ ...p, title: e.target.value, slug: p._id ? p.slug : slugify(e.target.value) }))} />
        </Field>
        <Field label="Adresse de la page" hint={`yassauto.fr/boutique/${f.slug || "…"}`}>
          <input className={input} value={f.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
        </Field>
        <Field label="Catégorie">
          <select className={input} value={f.category} onChange={(e) => set("category", e.target.value as Category)}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Vidéo d'installation" hint="Lien YouTube (ou lien direct vers la vidéo)">
          <input className={input} value={f.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://youtu.be/…" />
        </Field>
      </div>
      <Field label="Résumé (affiché sous le titre)">
        <input className={input} value={f.shortDescription} maxLength={300} onChange={(e) => set("shortDescription", e.target.value)} />
      </Field>
      <Field label="Description" hint="Le texte importé d'AliExpress est souvent en mauvais français : reformule l'essentiel.">
        <textarea className={`${input} h-32 font-mono text-xs`} value={f.description} onChange={(e) => set("description", e.target.value)} />
      </Field>

      {/* Photos */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Photos ({f.images.length}) — la première est la photo principale</p>
        <div className="flex flex-wrap gap-3">
          {f.images.map((src, i) => (
            <div key={src} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1">
                {i > 0 && (
                  <button title="Mettre en premier" onClick={() => set("images", [src, ...f.images.filter((x) => x !== src)])} className="text-white text-xs bg-black/60 rounded px-1">1er</button>
                )}
                <button title="Retirer" onClick={() => set("images", f.images.filter((x) => x !== src))} className="text-white"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
        <input
          className={input}
          placeholder="Ajouter une photo par URL puis Entrée"
          onKeyDown={(e) => {
            const v = (e.target as HTMLInputElement).value.trim();
            if (e.key === "Enter" && v.startsWith("http")) {
              set("images", [...f.images, v]);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
      </div>

      {/* Variantes & prix */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Variantes et prix</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr><th className="py-1">Variante</th><th>Coût livré + douane (€)</th><th>Prix TTC (€)</th><th>Marge nette</th><th>Dispo</th><th></th></tr>
            </thead>
            <tbody>
              {f.variants.map((v, i) => {
                const b = breakdown(v.priceTtcCents, v.costCents);
                return (
                  <tr key={i} className="border-t">
                    <td className="py-2 pr-2"><input className={input} value={v.label} onChange={(e) => setVariant(i, { label: e.target.value })} /></td>
                    <td className="pr-2"><input className={`${input} w-28`} defaultValue={euroInput(v.costCents)} onBlur={(e) => setVariant(i, { costCents: toCents(e.target.value) })} /></td>
                    <td className="pr-2"><input className={`${input} w-28`} defaultValue={euroInput(v.priceTtcCents)} onBlur={(e) => setVariant(i, { priceTtcCents: toCents(e.target.value) })} /></td>
                    <td className={`pr-2 whitespace-nowrap ${b.netMarginCents < 0 ? "text-red-600" : "text-green-700"}`}>
                      {formatEuros(b.netMarginCents)} ({Math.round(b.netMarginRate * 100)} % du HT)
                    </td>
                    <td><input type="checkbox" checked={v.available} onChange={(e) => setVariant(i, { available: e.target.checked })} /></td>
                    <td>{f.variants.length > 1 && <button onClick={() => set("variants", f.variants.filter((_, j) => j !== i))}><Trash2 size={16} className="text-gray-400 hover:text-red-600" /></button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button onClick={() => set("variants", [...f.variants, { sku: `v${f.variants.length + 1}`, label: "", aeSkuAttr: "", priceTtcCents: 0, costCents: 0, available: true }])} className="text-sm text-gray-600 hover:text-black inline-flex items-center gap-1"><Plus size={14} /> Ajouter une variante</button>
        <p className="text-xs text-gray-500">Marge nette = prix HT − coût − frais Stripe estimés. Le prix conseillé à l'import applique ton coefficient × 2,5.</p>
      </div>

      {/* Compatibilité */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Compatibilité véhicule</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.universal} onChange={(e) => set("universal", e.target.checked)} /> Universel (tous véhicules)
        </label>
        {!f.universal && (
          <>
            {f.fitments.map((fit, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
                <input className={input} placeholder="Marque" value={fit.brand} onChange={(e) => setFitment(i, { brand: e.target.value })} />
                <input className={input} placeholder="Modèle (ex. Golf 7)" value={fit.model} onChange={(e) => setFitment(i, { model: e.target.value })} />
                <input className={input} placeholder="De (année)" value={fit.yearFrom ?? ""} onChange={(e) => setFitment(i, { yearFrom: e.target.value ? Number(e.target.value) : undefined })} />
                <input className={input} placeholder="À (année)" value={fit.yearTo ?? ""} onChange={(e) => setFitment(i, { yearTo: e.target.value ? Number(e.target.value) : undefined })} />
                <button onClick={() => set("fitments", f.fitments.filter((_, j) => j !== i))} className="justify-self-start"><Trash2 size={16} className="text-gray-400 hover:text-red-600" /></button>
              </div>
            ))}
            <button onClick={() => set("fitments", [...f.fitments, { brand: "", model: "" }])} className="text-sm text-gray-600 hover:text-black inline-flex items-center gap-1"><Plus size={14} /> Ajouter un véhicule</button>
          </>
        )}
      </div>

      {/* Pose atelier */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={f.installOffer.enabled} onChange={(e) => set("installOffer", { ...f.installOffer, enabled: e.target.checked })} /> Proposer la pose à l'atelier de Gigean
        </label>
        {f.installOffer.enabled && (
          <div className="flex gap-3">
            <Field label="Prix de la pose TTC (€)"><input className={`${input} w-32`} defaultValue={euroInput(f.installOffer.priceTtcCents)} onBlur={(e) => set("installOffer", { ...f.installOffer, priceTtcCents: toCents(e.target.value) })} /></Field>
            <Field label="Durée (min)"><input className={`${input} w-24`} value={f.installOffer.durationMin} onChange={(e) => set("installOffer", { ...f.installOffer, durationMin: Number(e.target.value) || 0 })} /></Field>
          </div>
        )}
      </div>

      {/* Fournisseur */}
      <div className="grid md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-3">
        <Field label="ID produit AliExpress"><input className={input} value={f.supplier.productId} onChange={(e) => set("supplier", { ...f.supplier, productId: e.target.value })} /></Field>
        <Field label="URL AliExpress"><input className={input} value={f.supplier.url} onChange={(e) => set("supplier", { ...f.supplier, url: e.target.value })} /></Field>
        <Field label="Méthode d'envoi" hint={f.supplier.deliveryDaysMax ? `${f.supplier.deliveryDaysMin ?? "?"} à ${f.supplier.deliveryDaysMax} jours` : undefined}>
          <input className={input} value={f.supplier.logisticsServiceName ?? ""} onChange={(e) => set("supplier", { ...f.supplier, logisticsServiceName: e.target.value })} />
        </Field>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3 justify-end">
        <button disabled={saving} onClick={() => save("draft")} className={`${btn} border border-gray-300 hover:bg-gray-100`}>Enregistrer en brouillon</button>
        <button disabled={saving} onClick={() => save("published")} className={`${btn} bg-green-600 hover:bg-green-700 text-white`}>
          {saving && <Loader2 size={16} className="animate-spin" />} Publier
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function BoutiqueAdmin() {
  const [products, setProducts] = useState<ProductForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductForm | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/shop/admin/products");
    setProducts(res.ok ? await res.json() : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (p: ProductForm, status: Status) => {
    await fetch(`/api/shop/admin/products/${p._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    void load();
  };

  const remove = async (p: ProductForm) => {
    if (!window.confirm(`Supprimer « ${p.title} » ?`)) return;
    await fetch(`/api/shop/admin/products/${p._id}`, { method: "DELETE" });
    void load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Boutique</h1>
            <p className="text-gray-400 text-sm">Produits, prix et fournisseur</p>
          </div>
          <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"><ArrowLeft size={16} /> Réservations et devis</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <ConnectionCard />
        {editing ? (
          <ProductEditor key={editing._id ?? "new"} initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void load(); }} />
        ) : (
          <ImportBox onReady={setEditing} />
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr><th className="p-3">Produit</th><th>Catégorie</th><th>Prix</th><th>Marge</th><th>Statut</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="p-6 text-center text-gray-500">Chargement…</td></tr>}
              {!loading && products.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-gray-500">Aucun produit pour l'instant. Colle une URL AliExpress ci-dessus.</td></tr>}
              {products.map((p) => {
                const v = p.variants[0];
                const b = v ? breakdown(v.priceTtcCents, v.costCents) : null;
                return (
                  <tr key={p._id} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {p.images[0] ? <img src={p.images[0]} alt="" className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 rounded bg-gray-200" />}
                        <div>
                          <p className="font-medium">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.variants.length} variante(s){p.videoUrl ? " · vidéo" : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td>{CATEGORIES.find((c) => c.value === p.category)?.label}</td>
                    <td>{v ? formatEuros(v.priceTtcCents) : "—"}</td>
                    <td className={b && b.netMarginCents < 0 ? "text-red-600" : ""}>{b ? formatEuros(b.netMarginCents) : "—"}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${p.status === "published" ? "bg-green-100 text-green-800" : p.status === "draft" ? "bg-gray-100 text-gray-700" : "bg-red-100 text-red-700"}`}>{STATUS_LABEL[p.status]}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button title="Modifier" onClick={() => setEditing({ ...emptyForm(), ...p, videoUrl: p.videoUrl ?? "", installOffer: p.installOffer ?? emptyForm().installOffer })}><PenLine size={18} /></button>
                        {p.status === "published" ? (
                          <button title="Retirer de la boutique" onClick={() => setStatus(p, "draft")}><EyeOff size={18} /></button>
                        ) : (
                          <button title="Publier" onClick={() => setStatus(p, "published")}><Eye size={18} /></button>
                        )}
                        <button title="Supprimer" onClick={() => remove(p)}><Trash2 size={18} className="text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
