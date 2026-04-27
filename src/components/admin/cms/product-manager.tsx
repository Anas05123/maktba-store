"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  ExternalLink,
  PackagePlus,
  PencilLine,
  Shapes,
  Sparkles,
  Tag,
  Upload,
  X,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  parseSpecificationLines,
  parseTagList,
  slugifyValue,
  stringifySpecifications,
} from "@/lib/slugs";

type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
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
  promotionalPrice: number | null;
  costPrice: number;
  lowStockThreshold: number;
  tags: string[];
  specifications: Record<string, string>;
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
  barcode: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  unit: "piece",
  packSize: 1,
  minimumOrderQuantity: 1,
  stockOnHand: 0,
  retailPrice: 0,
  wholesalePrice: 0,
  promotionalPrice: "",
  costPrice: 0,
  lowStockThreshold: 0,
  tags: "",
  specifications: "",
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

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/58">{children}</p>
  );
}

export function ProductManager() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [liveMode, setLiveMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isSlugManual, setIsSlugManual] = useState(false);
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
  const normalizedSlug = useMemo(
    () => slugifyValue(form.slug || form.name),
    [form.slug, form.name],
  );
  const publicPreviewHref = normalizedSlug ? `/products/${normalizedSlug}` : null;

  const textInputClassName =
    "h-[52px] rounded-[20px] border-white/15 bg-slate-950/85 px-4 text-sm text-white placeholder:text-white/35";
  const textareaClassName =
    "min-h-[132px] rounded-[24px] border-white/15 bg-slate-950/85 px-4 py-3 text-sm text-white placeholder:text-white/35";

  useEffect(() => {
    if (!selectedProduct) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: selectedProduct.name,
      slug: selectedProduct.slug,
      sku: selectedProduct.sku,
      barcode: selectedProduct.barcode,
      shortDescription: selectedProduct.shortDescription,
      description: selectedProduct.description,
      categoryId: selectedProduct.categoryId,
      unit: selectedProduct.unit,
      packSize: selectedProduct.packSize,
      minimumOrderQuantity: selectedProduct.minimumOrderQuantity,
      stockOnHand: selectedProduct.stockOnHand,
      retailPrice: selectedProduct.retailPrice,
      wholesalePrice: selectedProduct.wholesalePrice,
      promotionalPrice:
        selectedProduct.promotionalPrice && selectedProduct.promotionalPrice > 0
          ? String(selectedProduct.promotionalPrice)
          : "",
      costPrice: selectedProduct.costPrice,
      lowStockThreshold: selectedProduct.lowStockThreshold,
      tags: selectedProduct.tags.join(", "),
      specifications: stringifySpecifications(selectedProduct.specifications),
      isFeatured: selectedProduct.isFeatured,
      isActive: selectedProduct.isActive,
      imageUrls: selectedProduct.imageUrls.join("\n"),
    });
    setIsSlugManual(true);
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedId || isSlugManual) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      slug: prev.name ? slugifyValue(prev.name) : "",
    }));
  }, [form.name, isSlugManual, selectedId]);

  function getNumberInputValue(value: number) {
    if (!selectedId && value === 0) {
      return "";
    }

    return String(value);
  }

  function openNewProduct() {
    setSelectedId(null);
    setForm(emptyForm);
    setIsSlugManual(false);
    setMessage(null);
    setUploadMessage(null);
    setIsEditorOpen(true);
  }

  function openEditProduct(id: string) {
    setSelectedId(id);
    setIsSlugManual(true);
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

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    startUploadTransition(async () => {
      setUploadMessage(null);

      try {
        const urls = await uploadAdminImages(files);
        updateImageList(Array.from(new Set([...imageList, ...urls])));
        setUploadMessage(
          `${urls.length} image${urls.length > 1 ? "s" : ""} ajoutee${
            urls.length > 1 ? "s" : ""
          }.`,
        );
      } catch (error) {
        setUploadMessage(error instanceof Error ? error.message : "Upload impossible.");
      } finally {
        event.target.value = "";
      }
    });
  }

  function handleSave() {
    startTransition(async () => {
      setMessage(null);
      const payload = {
        ...form,
        slug: normalizedSlug,
        sku: form.sku.trim(),
        barcode: form.barcode.trim(),
        unit: "piece",
        packSize: 1,
        minimumOrderQuantity: 1,
        wholesalePrice: form.retailPrice,
        promotionalPrice:
          typeof form.promotionalPrice === "string" && form.promotionalPrice.trim() !== ""
            ? Number(form.promotionalPrice)
            : null,
        tags: parseTagList(form.tags),
        specifications: parseSpecificationLines(form.specifications),
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
      setMessage(result.message ?? "Produit enregistre.");
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
      setMessage(result.message ?? "Produit supprime.");
      if (response.ok) {
        setSelectedId(null);
        await load();
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
                <p className="text-sm uppercase tracking-[0.18em] text-white/45">
                  Catalogue produit
                </p>
                <h1 className="mt-2 text-3xl font-semibold">Produits & fiches article</h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
                  Ajoutez une vraie fiche e-commerce avec resume clair, images propres,
                  caracteristiques utiles et prix facile a comprendre.
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
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                  >
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
                Connexion base indisponible: la gestion live du catalogue est temporairement desactivee.
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

                <div className="grid gap-4 sm:grid-cols-[108px_1fr]">
                  <div className="relative aspect-square overflow-hidden rounded-[22px] border border-white/10 bg-slate-900/80">
                    <Image
                      src={getSafeImageSrc(product.imageUrls[0])}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="line-clamp-2 text-sm leading-6 text-white/70">
                      {product.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Prix", value: formatTnd(product.retailPrice) },
                    {
                      label: "Promo",
                      value:
                        product.promotionalPrice && product.promotionalPrice > 0
                          ? formatTnd(product.promotionalPrice)
                          : "Aucune",
                    },
                    { label: "Stock", value: `${product.stockOnHand}` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-white/10 bg-white/5 p-3"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-white/45">
                        {item.label}
                      </p>
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
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "rounded-full border-primary/30 bg-primary/10 text-white hover:bg-primary/20 hover:text-white",
                    })}
                  >
                    <ExternalLink className="size-4" />
                    Voir la fiche
                  </Link>
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
        <DialogContent className="max-w-[calc(100%-1rem)] overflow-hidden border border-white/10 bg-slate-950 p-0 text-white sm:max-w-[min(1480px,98vw)]">
          <DialogHeader className="border-b border-white/10 px-6 py-5">
            <DialogTitle className="text-2xl">
              {selectedId ? "Editer le produit" : "Ajouter un produit"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Completez la fiche article comme une vraie page e-commerce: resume, photo,
              reference, details utiles et prix clairs pour les parents.
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[86vh] gap-0 xl:grid-cols-[minmax(0,1.15fr)_minmax(430px,0.85fr)]">
            <div className="min-h-0 space-y-4 overflow-y-auto px-6 py-5">
              {message ? (
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm">
                  {message}
                </div>
              ) : null}

              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Informations principales</p>
                <p className="mt-1 text-xs leading-6 text-white/60">
                  Donnez un nom clair, une reference facile a retrouver et un rayon bien choisi.
                </p>

                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-2">
                      <SectionLabel>Nom du produit</SectionLabel>
                      <Input
                        className={textInputClassName}
                        placeholder="Ex: Regle plate 20 cm transparente"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <SectionLabel>Categorie</SectionLabel>
                      <select
                        className="h-[52px] w-full rounded-[20px] border border-white/15 bg-slate-950 px-4 text-sm text-white"
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

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <SectionLabel>Slug public</SectionLabel>
                      <Input
                        className={textInputClassName}
                        placeholder="regle-plate-20cm"
                        value={form.slug}
                        onChange={(e) => {
                          setIsSlugManual(true);
                          setForm((prev) => ({ ...prev, slug: slugifyValue(e.target.value) }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <SectionLabel>SKU / Ref.</SectionLabel>
                      <Input
                        className={textInputClassName}
                        placeholder="MAT-REG-20"
                        value={form.sku}
                        onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <SectionLabel>Code-barres</SectionLabel>
                      <Input
                        className={textInputClassName}
                        placeholder="629..."
                        value={form.barcode}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, barcode: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <SectionLabel>Resume rapide</SectionLabel>
                    <Input
                      className={textInputClassName}
                      placeholder="La phrase utile qui aide a comprendre vite le produit"
                      value={form.shortDescription}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, shortDescription: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <SectionLabel>Description client</SectionLabel>
                    <Textarea
                      className={textareaClassName}
                      placeholder="Expliquez a quoi sert le produit, pour quel age ou usage, et pourquoi il est pratique au quotidien."
                      rows={6}
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <SectionLabel>Caracteristiques detaillees</SectionLabel>
                    <Textarea
                      className={textareaClassName}
                      placeholder={
                        "Une caracteristique par ligne\nMarque: Graphmate\nMatiere: Plastique transparent\nLongueur: 20 cm\nUsage: Ecole et bureau"
                      }
                      rows={7}
                      value={form.specifications}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, specifications: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <SectionLabel>Tags / mots utiles</SectionLabel>
                    <Input
                      className={textInputClassName}
                      placeholder="rentree, primaire, eco, trousse, bureau"
                      value={form.tags}
                      onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-primary/20 bg-primary/10 p-5 text-sm leading-7 text-white/82">
                Conseil UX: donnez une photo nette, un nom simple, 3 a 6 caracteristiques
                utiles et une description qui parle comme un parent ou un acheteur normal, pas
                comme un grossiste.
              </div>
            </div>

            <aside className="min-h-0 space-y-4 overflow-y-auto border-t border-white/10 bg-slate-950/60 px-6 py-5 xl:border-l xl:border-t-0">
              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Prix, stock & mise en avant</p>
                <p className="mt-1 text-xs text-white/60">
                  Renseignez uniquement les chiffres utiles pour la vente au detail.
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <SectionLabel>Prix de vente (TND)</SectionLabel>
                    <Input
                      className={textInputClassName}
                      type="number"
                      placeholder="Ex: 12.900"
                      value={getNumberInputValue(form.retailPrice)}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          retailPrice: parseNumberInput(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>Prix promo</SectionLabel>
                    <Input
                      className={textInputClassName}
                      type="number"
                      placeholder="Ex: 9.900"
                      value={form.promotionalPrice}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, promotionalPrice: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>Cout interne</SectionLabel>
                    <Input
                      className={textInputClassName}
                      type="number"
                      placeholder="Ex: 6.200"
                      value={getNumberInputValue(form.costPrice)}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          costPrice: parseNumberInput(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>Stock disponible</SectionLabel>
                    <Input
                      className={textInputClassName}
                      type="number"
                      placeholder="Ex: 24"
                      value={getNumberInputValue(form.stockOnHand)}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          stockOnHand: parseNumberInput(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>Seuil d&apos;alerte</SectionLabel>
                    <Input
                      className={textInputClassName}
                      type="number"
                      placeholder="Ex: 5"
                      value={getNumberInputValue(form.lowStockThreshold)}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          lowStockThreshold: parseNumberInput(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>Quantite panier</SectionLabel>
                    <Input className={textInputClassName} type="number" value="1" disabled />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "Produit visible",
                      active: form.isActive,
                      onClick: () => setForm((prev) => ({ ...prev, isActive: !prev.isActive })),
                    },
                    {
                      label: "Mettre en avant",
                      active: form.isFeatured,
                      onClick: () =>
                        setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured })),
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`rounded-[22px] border px-4 py-4 text-left transition ${
                        item.active
                          ? "border-primary/40 bg-primary/15 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                      onClick={item.onClick}
                    >
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-1 text-xs text-white/60">
                        {item.active ? "Actif actuellement" : "Desactive pour le moment"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Images du produit</p>
                    <p className="mt-1 text-xs leading-6 text-white/60">
                      Ajoutez vos vraies photos produit depuis le bureau ou collez des URLs
                      directes.
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
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/82">
                    {uploadMessage}
                  </div>
                ) : null}

                <div className="mt-4 space-y-2">
                  <SectionLabel>URLs ou chemins des images</SectionLabel>
                  <Textarea
                    className="min-h-[112px] rounded-[24px] border-white/15 bg-slate-950/85 px-4 py-3 text-sm text-white placeholder:text-white/35"
                    placeholder="Une URL ou un chemin /uploads/... par ligne"
                    rows={4}
                    value={form.imageUrls}
                    onChange={(e) => setForm((prev) => ({ ...prev, imageUrls: e.target.value }))}
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {imageList.length > 0 ? (
                    imageList.map((url) => (
                      <div
                        key={url}
                        className="overflow-hidden rounded-[22px] border border-white/10 bg-slate-900/70"
                      >
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
                      Aucune image pour le moment. Importez une vraie photo produit ou collez
                      une URL propre avant publication.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Apercu & navigation</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                    <SectionLabel>Slug final</SectionLabel>
                    <p className="mt-2 text-sm text-white/85">
                      {normalizedSlug || "Le slug sera genere depuis le nom du produit"}
                    </p>
                  </div>

                  {publicPreviewHref ? (
                    <Link
                      href={publicPreviewHref}
                      target="_blank"
                      className={buttonVariants({
                        variant: "outline",
                        className:
                          "w-full rounded-full border-primary/30 bg-primary/10 text-white hover:bg-primary/20 hover:text-white",
                      })}
                    >
                      <ExternalLink className="size-4" />
                      Ouvrir la fiche publique
                    </Link>
                  ) : null}

                  <div className="rounded-[22px] border border-primary/20 bg-primary/10 p-4 text-sm leading-7 text-white/82">
                    Astuce: pour une page produit convaincante, montrez une belle photo, un
                    titre facile a lire, une petite phrase utile, puis une fiche technique
                    courte avec les details qui interessent les parents.
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 px-6 py-4">
            <div className="text-sm text-white/55">
              {selectedId ? "Modification de la fiche existante" : "Creation d'une nouvelle fiche"}
            </div>
            <div className="flex flex-wrap gap-3">
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
              <Button
                className="rounded-full"
                onClick={handleSave}
                disabled={isPending || !liveMode}
              >
                {selectedId ? "Mettre a jour" : "Ajouter le produit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
