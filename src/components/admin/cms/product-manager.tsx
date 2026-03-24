"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatTnd } from "@/lib/format";

type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  categoryName: string;
  unit: string;
  packSize: number;
  minimumOrderQuantity: number;
  stockOnHand: number;
  retailPrice: number;
  wholesalePrice: number;
  costPrice: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isActive: boolean;
  imageUrls: string[];
};

type CategoryRecord = {
  id: string;
  name: string;
};

const emptyForm = {
  name: "",
  slug: "",
  sku: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  unit: "piece",
  packSize: 1,
  minimumOrderQuantity: 1,
  stockOnHand: 0,
  retailPrice: 0,
  wholesalePrice: 0,
  costPrice: 0,
  lowStockThreshold: 0,
  isFeatured: false,
  isActive: true,
  imageUrls: "",
};

export function ProductManager() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [liveMode, setLiveMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const [productResponse, categoryResponse] = await Promise.all([
      fetch("/api/admin/products", { cache: "no-store" }),
      fetch("/api/admin/categories", { cache: "no-store" }),
    ]);
    const productPayload = await productResponse.json();
    const categoryPayload = await categoryResponse.json();
    setProducts(productPayload.data ?? []);
    setCategories(categoryPayload.data ?? []);
    setLiveMode(Boolean(productPayload.live));
  }

  useEffect(() => {
    void load();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? null,
    [products, selectedId],
  );

  useEffect(() => {
    if (!selectedProduct) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: selectedProduct.name,
      slug: selectedProduct.slug,
      sku: selectedProduct.sku,
      shortDescription: selectedProduct.shortDescription,
      description: selectedProduct.description,
      categoryId: selectedProduct.categoryId,
      unit: selectedProduct.unit,
      packSize: selectedProduct.packSize,
      minimumOrderQuantity: selectedProduct.minimumOrderQuantity,
      stockOnHand: selectedProduct.stockOnHand,
      retailPrice: selectedProduct.retailPrice,
      wholesalePrice: selectedProduct.wholesalePrice,
      costPrice: selectedProduct.costPrice,
      lowStockThreshold: selectedProduct.lowStockThreshold,
      isFeatured: selectedProduct.isFeatured,
      isActive: selectedProduct.isActive,
      imageUrls: selectedProduct.imageUrls.join("\n"),
    });
  }, [selectedProduct]);

  function handleSave() {
    startTransition(async () => {
      setMessage(null);
      const payload = {
        ...form,
        imageUrls: form.imageUrls
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean),
      };

      const response = await fetch(
        selectedId ? `/api/admin/products/${selectedId}` : "/api/admin/products",
        {
          method: selectedId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      setMessage(result.message ?? "Saved");
      if (response.ok) {
        setSelectedId(null);
        await load();
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const result = await response.json();
      setMessage(result.message ?? "Deleted");
      if (response.ok) {
        setSelectedId(null);
        await load();
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>{selectedId ? "Editer un produit" : "Ajouter un produit"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!liveMode ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-300/10 p-4 text-sm text-amber-50">
              Mode demo: branchez PostgreSQL pour activer le vrai CRUD.
            </div>
          ) : null}
          {message ? (
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">
              {message}
            </div>
          ) : null}
          <Input placeholder="Nom du produit" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} />
            <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))} />
          </div>
          <Input placeholder="Description courte" value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} />
          <Textarea placeholder="Description complete" rows={4} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm"
            value={form.categoryId}
            onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
          >
            <option value="">Choisir une categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" placeholder="Prix retail" value={form.retailPrice} onChange={(e) => setForm((prev) => ({ ...prev, retailPrice: Number(e.target.value) }))} />
            <Input type="number" placeholder="Prix pack" value={form.wholesalePrice} onChange={(e) => setForm((prev) => ({ ...prev, wholesalePrice: Number(e.target.value) }))} />
            <Input type="number" placeholder="Cout" value={form.costPrice} onChange={(e) => setForm((prev) => ({ ...prev, costPrice: Number(e.target.value) }))} />
            <Input type="number" placeholder="Stock" value={form.stockOnHand} onChange={(e) => setForm((prev) => ({ ...prev, stockOnHand: Number(e.target.value) }))} />
            <Input type="number" placeholder="Seuil" value={form.lowStockThreshold} onChange={(e) => setForm((prev) => ({ ...prev, lowStockThreshold: Number(e.target.value) }))} />
            <Input type="number" placeholder="Lot suggere" value={form.minimumOrderQuantity} onChange={(e) => setForm((prev) => ({ ...prev, minimumOrderQuantity: Number(e.target.value) }))} />
          </div>
          <Textarea placeholder="Une URL d'image par ligne" rows={4} value={form.imageUrls} onChange={(e) => setForm((prev) => ({ ...prev, imageUrls: e.target.value }))} />
          <div className="flex gap-3">
            <Button className="rounded-full" onClick={handleSave} disabled={isPending || !liveMode}>
              {selectedId ? "Mettre a jour" : "Ajouter"}
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setSelectedId(null)}>
              Nouveau
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-semibold">{product.name}</p>
                <p className="text-sm text-white/60">
                  {product.categoryName} • {product.sku}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {formatTnd(product.retailPrice)} • stock {product.stockOnHand}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={() => setSelectedId(product.id)}>
                  Editer
                </Button>
                <Button variant="destructive" className="rounded-full" onClick={() => handleDelete(product.id)} disabled={!liveMode || isPending}>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
