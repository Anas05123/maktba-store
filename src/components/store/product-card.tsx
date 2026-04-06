"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { PriceBlock } from "@/components/store/price-block";
import { getSafeImageSrc } from "@/lib/images";

export function ProductCard({
  product,
}: {
  product: {
    slug: string;
    sku: string;
    name: string;
    shortDescription: string;
    images: string[];
    tags: string[];
    stockOnHand: number;
    minimumOrderQuantity: number;
    wholesalePrice: number;
    retailPrice: number;
    priceTiers?:
      | Array<{
          label: string;
          minQuantity: number;
          maxQuantity?: number;
          price: number;
        }>
      | undefined;
    categoryName?: string | undefined;
  };
}) {
  const startingQuantity = 1;
  const priceHighlight =
    product.retailPrice <= 15
      ? "Petit prix pour la rentree"
      : product.tags.some((tag) => ["premium", "best-seller", "bagagerie"].includes(tag))
        ? "Choix parents le plus aime"
        : "Pratique pour l'ecole et la maison";

  return (
    <Card className="group overflow-hidden rounded-[32px] border-white/70 bg-white/95 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/55">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={getSafeImageSrc(product.images[0])}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          {product.categoryName ? (
            <Badge className="rounded-full bg-white/90 text-slate-900 hover:bg-white/90">
              {product.categoryName}
            </Badge>
          ) : (
            <span />
          )}
          <div className="rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-medium text-white">
            {product.stockOnHand > 0 ? "En stock" : "Sur commande"}
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-white/88 px-4 py-3 text-slate-950 backdrop-blur-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">A partir de</p>
            <p className="mt-1 text-2xl font-semibold">{product.retailPrice.toFixed(3)} TND</p>
          </div>
          {product.tags[0] ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
              {product.tags[0]}
            </span>
          ) : null}
        </div>
      </div>
      <CardContent className="space-y-5 p-5">
        <div className="space-y-2">
          <Link href={`/products/${product.slug}`} className="group inline-flex items-start gap-2">
            <h3 className="text-xl font-semibold leading-7">{product.name}</h3>
            <ArrowUpRight className="mt-1 size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
            {product.stockOnHand > 0 ? "Pret a commander" : "Disponible sur demande"}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            {product.retailPrice <= 15 ? "Budget malin" : "Belle finition"}
          </span>
        </div>

        <PriceBlock
          primaryPrice={product.retailPrice}
          helperText="Prix visible, en TND"
          highlightText={priceHighlight}
        />

        <div className="flex items-center justify-between gap-3">
          <Link href={`/products/${product.slug}`} className="text-sm font-medium text-primary">
            Voir le produit
          </Link>
          <AddToCartButton
            product={{
              sku: product.sku,
              slug: product.slug,
              name: product.name,
              images: product.images,
              categoryName: product.categoryName,
              stockOnHand: product.stockOnHand,
              minimumOrderQuantity: product.minimumOrderQuantity,
              wholesalePrice: product.wholesalePrice,
              retailPrice: product.retailPrice,
              tags: product.tags,
              priceTiers: product.priceTiers,
            }}
            quantity={startingQuantity}
            label="Ajouter"
          />
        </div>
      </CardContent>
    </Card>
  );
}
