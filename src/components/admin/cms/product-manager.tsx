"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  PackagePlus,
  PencilLine,
  Shapes,
  Sparkles,
  Tag,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadAdminImages } from "@/lib/admin/upload-client";
import { formatTnd } from "@/lib/format";
import { getSafeImageSrc } from "@/lib/images";

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

function parseNumberInput(value: string) {
  return value === "" ? 0 : Number(value);
}

function parseImageList(raw: string) {
  return raw
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

export function ProductManager() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [liveMode, setLiveMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  const imageList = useMemo(() => parseImageList(form.imageUrls), [form.imageUrls]);

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
        unit: "piece",
        packSize: 1,
        minimumOrderQuantity: 1,
        wholesalePrice: form.wholesalePrice > 0 ? form.wholesalePrice : form.retailPrice,
        imageUrls: imageList,
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
        setIsEditorOpen(false);
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

  function getNumberInputValue(value: number) {
    if (!selectedId && value === 0) {
      return "";
    }

    return String(value);
  }

  function openNewProduct() {
    setSelectedId(null);
    setForm(emptyForm);
    setMessage(null);
    setUploadMessage(null);
    setIsEditorOpen(true);
  }

  function openEditProduct(id: string) {
    setSelectedId(id);
    setMessage(null);
    setUploadMessage(null);
    setIsEditorOpen(true);
  }

  function updateImageList(nextImages: string[]) {
    setForm((prev) => ({ ...prev, imageUrls: nextImages.join("\n") }));
  }

  function removeImage(url: string) {
    updateImageList(imageList.filter((item) => item !== url));
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    startUploadTransition(async () => {
      setUploadMessage(null);

      try {
        const urls = await uploadAdminImages(files);
        updateImageList([...imageList, ...urls]);
        setUploadMessage(`${urls.length} image${urls.length > 1 ? "s" : ""} ajoutee${urls.length > 1 ? "s" : ""}.`);
      } catch (error) {
        setUploadMessage(error instanceof Error ? error.message : "Upload impossible.");
      } finally {
        event.target.value = "";
      }
    });
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="rounded-[32px] border-white/10 bg-slate-900 bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(15,23,42,0.96))] text-white shadow-2xl shadow-slate-950/20">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-white/45">Catalogue produit</p>
                <h1 className="mt-2 text-3xl font-semibold">Produits & fiches article</h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
                  Ajoutez, corrigez et classez les articles rapidement via une fenetre dediee, sans quitter la liste.
                </p>
              </div>
              <Button className="rounded-full" size="lg" onClick={openNewProduct} disabled={!liveMode}>
                <PackagePlus className="size-4" />
                Nouveau produit
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Produits actifs",
                  value: `${products.filter((product) => product.isActive).length}`,
                  icon: Shapes,
                },
                {
                  label: "Mis en avant",
                  value: `${products.filter((product) => product.isFeatured).length}`,
                  icon: Sparkles,
                },
                {
                  label: "Stock faible",
                  value: `${products.filter((product) => product.stockOnHand <= product.lowStockThreshold).length}`,
                  icon: Tag,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/55">{item.label}</p>
                        <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-3 text-primary">
                        <Icon className="size-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

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
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          {products.map((product) => (
            <Card key={product.id} className="rounded-[28px] border-white/10 bg-white/5 text-white">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{product.name}</p>
                    <p className="text-sm text-white/60">
                      {product.categoryName} • {product.sku}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/65">
                    {product.isFeatured ? "Vedette" : "Standard"}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Prix", value: formatTnd(product.retailPrice) },
                    { label: "Stock", value: `${product.stockOnHand}` },
                    { label: "Alerte", value: `${product.lowStockThreshold}` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/5 p-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-white/45">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    onClick={() => openEditProduct(product.id)}
                  >
                    <PencilLine className="size-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => handleDelete(product.id)}
                    disabled={!liveMode || isPending}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={isEditorOpen}
        onOpenChange={(open) => {
          setIsEditorOpen(open);
          if (!open) {
            setSelectedId(null);
          }
        }}
      >
        <DialogContent className="max-w-[calc(100%-1rem)] border border-white/10 bg-slate-950 p-0 text-white sm:max-w-[min(1120px,95vw)]">
          <DialogHeader className="border-b border-white/10 px-6 py-5">
            <DialogTitle className="text-2xl">
              {selectedId ? "Editer le produit" : "Ajouter un produit"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Modifiez la fiche article dans une fenetre dediee, puis revenez instantanement a votre liste.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[82vh] overflow-y-auto px-6 py-5">
            {message ? (
              <div className="mb-4 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">
                {message}
              </div>
            ) : null}

            <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4">
                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">Informations principales</p>
                  <p className="mt-1 text-xs leading-6 text-white/60">
                    Donnez un nom clair, une description simple et une categorie facile a comprendre.
                  </p>

                  <div className="mt-4 space-y-4">
                    <Input
                      placeholder="Nom du produit"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        placeholder="Slug"
                        value={form.slug}
                        onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                      />
                      <Input
                        placeholder="SKU"
                        value={form.sku}
                        onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))}
                      />
                    </div>
                    <Input
                      placeholder="Description courte"
                      value={form.shortDescription}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, shortDescription: e.target.value }))
                      }
                    />
                    <Textarea
                      placeholder="Description complete"
                      rows={6}
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                    <select
                      className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm"
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                      }
                    >
                      <option value="">Choisir une categorie</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">Informations commerciales</p>
                  <p className="mt-1 text-xs text-white/60">
                    Renseignez uniquement les chiffres utiles pour la vente au detail.
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Prix de vente (TND)</p>
                      <Input type="number" placeholder="Ex: 12.900" value={getNumberInputValue(form.retailPrice)} onChange={(e) => setForm((prev) => ({ ...prev, retailPrice: parseNumberInput(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Prix promo (optionnel)</p>
                      <Input type="number" placeholder="Ex: 10.900" value={getNumberInputValue(form.wholesalePrice)} onChange={(e) => setForm((prev) => ({ ...prev, wholesalePrice: parseNumberInput(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Cout interne</p>
                      <Input type="number" placeholder="Ex: 7.500" value={getNumberInputValue(form.costPrice)} onChange={(e) => setForm((prev) => ({ ...prev, costPrice: parseNumberInput(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Stock disponible</p>
                      <Input type="number" placeholder="Ex: 24" value={getNumberInputValue(form.stockOnHand)} onChange={(e) => setForm((prev) => ({ ...prev, stockOnHand: parseNumberInput(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Seuil d&apos;alerte</p>
                      <Input type="number" placeholder="Ex: 5" value={getNumberInputValue(form.lowStockThreshold)} onChange={(e) => setForm((prev) => ({ ...prev, lowStockThreshold: parseNumberInput(e.target.value) }))} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/60">Quantite initiale panier</p>
                      <Input type="number" placeholder="1" value="1" disabled />
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Images du produit</p>
                      <p className="mt-1 text-xs leading-6 text-white/60">
                        Importez des images depuis votre bureau ou collez des liens existants.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        multiple
                        className="hidden"
                        onChange={handleUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="size-4" />
                        {isUploading ? "Envoi..." : "Importer depuis le bureau"}
                      </Button>
                    </div>
                  </div>

                  {uploadMessage ? (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80">
                      {uploadMessage}
                    </div>
                  ) : null}

                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder="Une URL ou un chemin /uploads/... par ligne"
                      rows={4}
                      value={form.imageUrls}
                      onChange={(e) => setForm((prev) => ({ ...prev, imageUrls: e.target.value }))}
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {imageList.length > 0 ? (
                      imageList.map((url) => (
                        <div key={url} className="overflow-hidden rounded-[22px] border border-white/10 bg-slate-900/70">
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={getSafeImageSrc(url)}
                              alt={form.name || "Image produit"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-3 px-3 py-3">
                            <p className="line-clamp-1 text-xs text-white/65">{url}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                              onClick={() => removeImage(url)}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full rounded-[22px] border border-dashed border-white/10 bg-slate-900/60 p-6 text-center text-sm text-white/55">
                        Aucune image pour le moment.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 px-6 py-4">
            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={() => {
                setIsEditorOpen(false);
                setSelectedId(null);
              }}
            >
              Annuler
            </Button>
            <Button className="rounded-full" onClick={handleSave} disabled={isPending || !liveMode}>
              {selectedId ? "Mettre a jour" : "Ajouter"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
