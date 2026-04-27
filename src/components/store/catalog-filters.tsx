"use client";

import Link from "next/link";
import { LayoutGrid, List, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/store/product-card";
import { ProductListItem } from "@/components/store/product-list-item";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Product = {
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  categorySlug: string;
  categoryName?: string | undefined;
  brandName?: string | undefined;
  tags: string[];
  images: string[];
  stockOnHand: number;
  minimumOrderQuantity: number;
  wholesalePrice: number;
  retailPrice: number;
  priceTiers?: Array<{
    label: string;
    minQuantity: number;
    maxQuantity?: number;
    price: number;
  }> | undefined;
};

type PriceBand = "all" | "under10" | "10to25" | "over25";

export function CatalogFilters({
  products,
  categories,
  initialCategory = "all",
  initialQuery = "",
}: {
  products: Product[];
  categories: Array<{ slug: string; name: string }>;
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceBand, setPriceBand] = useState<PriceBand>("all");
  const [sortBy, setSortBy] = useState("popular");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      product.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = category === "all" || product.categorySlug === category;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.shortDescription.toLowerCase().includes(normalizedQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => product.tags.includes(tag));

      const matchesPrice =
        priceBand === "all" ||
        (priceBand === "under10" && product.retailPrice < 10) ||
        (priceBand === "10to25" &&
          product.retailPrice >= 10 &&
          product.retailPrice <= 25) ||
        (priceBand === "over25" && product.retailPrice > 25);
      const matchesStock = !inStockOnly || product.stockOnHand > 0;

      return matchesCategory && matchesQuery && matchesTags && matchesPrice && matchesStock;
    });

    const sorted = [...filtered];

    if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.retailPrice - b.retailPrice);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.retailPrice - a.retailPrice);
    } else if (sortBy === "stock") {
      sorted.sort((a, b) => b.stockOnHand - a.stockOnHand);
    } else {
      sorted.sort((a, b) => Number(Boolean(b.tags[0])) - Number(Boolean(a.tags[0])));
    }

    return sorted;
  }, [category, inStockOnly, priceBand, products, query, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  const resetFilters = () => {
    setQuery(initialQuery);
    setCategory(initialCategory);
    setSelectedTags([]);
    setPriceBand("all");
    setSortBy("popular");
    setInStockOnly(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-sm">
            <p className="text-lg font-semibold">Filtrer</p>

            <div className="mt-5 space-y-3">
              <p className="text-sm font-medium text-foreground">Recherche</p>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cahier, stylo, cartable..."
                  className="h-11 rounded-full pl-10"
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Categories</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-primary underline"
                >
                  Reinitialiser
                </button>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
                    category === "all"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-white hover:bg-muted/40",
                  )}
                  onClick={() => setCategory("all")}
                >
                  <span>Toutes les categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((item) => {
                  const count = products.filter(
                    (product) => product.categorySlug === item.slug,
                  ).length;

                  return (
                    <button
                      key={item.slug}
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
                        category === item.slug
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-white hover:bg-muted/40",
                      )}
                      onClick={() => setCategory(item.slug)}
                    >
                      <span>{item.name}</span>
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-foreground">Prix</p>
              <div className="grid gap-2">
                {[
                  { id: "all", label: "Tous les prix" },
                  { id: "under10", label: "Moins de 10 DT" },
                  { id: "10to25", label: "10 DT - 25 DT" },
                  { id: "over25", label: "Plus de 25 DT" },
                ].map((band) => (
                  <button
                    key={band.id}
                    type="button"
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left text-sm transition",
                      priceBand === band.id
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-white hover:bg-muted/40",
                    )}
                    onClick={() => setPriceBand(band.id as PriceBand)}
                  >
                    {band.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-foreground">Suggestions</p>
              <div className="space-y-3">
                {topTags.map((tag) => (
                  <label key={tag} className="flex items-center gap-3 text-sm">
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-foreground">Disponibilite</p>
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={(checked) => setInStockOnly(Boolean(checked))}
                />
                <span>Afficher seulement les produits en stock</span>
              </label>
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-5 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-white/55">Aide parents</p>
            <div className="mt-4 space-y-3 text-sm text-white/80">
              <p>Prix affiches en TND, faciles a comparer</p>
              <p>Paiement a la livraison disponible</p>
              <p>Livraison sur toute la Tunisie</p>
            </div>
            <Link
              href="/categories/packs-grossiste"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-slate-950"
            >
              Voir les packs scolaires
            </Link>
          </div>
        </div>
      </aside>

      <div className="space-y-5">
        <div className="rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition",
                  category === "all"
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-white text-muted-foreground hover:bg-muted/40",
                )}
                onClick={() => setCategory("all")}
              >
                Tout le catalogue
              </button>
              {categories.slice(0, 6).map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition",
                    category === item.slug
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-white text-muted-foreground hover:bg-muted/40",
                  )}
                  onClick={() => setCategory(item.slug)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setView("list")}
                >
                  <List className="size-4" />
                </Button>
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <p className="ml-2 text-sm text-muted-foreground">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="text-sm text-muted-foreground">Trier par</p>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value ?? "popular")}>
                  <SelectTrigger className="h-11 min-w-[220px] rounded-full bg-white px-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Les plus demandes</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix decroissant</SelectItem>
                    <SelectItem value="stock">Disponibilite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          view === "list" ? (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductListItem key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-[32px] border border-dashed border-border bg-white/90 p-10 text-center shadow-sm">
            <p className="text-lg font-semibold">Aucun produit ne correspond a votre recherche.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Essayez une autre categorie ou un terme plus simple comme cahier, stylo ou ramette.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
