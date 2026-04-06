"use client";

import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTnd } from "@/lib/format";
import { getSafeImageSrc } from "@/lib/images";

export function ProductListItem({
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
    retailPrice: number;
    wholesalePrice: number;
    brandName?: string | undefined;
    categoryName?: string | undefined;
    priceTiers?:
      | Array<{
          label: string;
          minQuantity: number;
          maxQuantity?: number;
          price: number;
        }>
      | undefined;
  };
}) {
  const quantity = 1;
  const helperTag =
    product.retailPrice <= 15 ? "Petit budget" : "Bon choix pour la rentree";

  return (
    <Card className="overflow-hidden rounded-[28px] border-white/70 bg-white/95 shadow-sm transition hover:shadow-lg">
      <div className="grid gap-4 p-4 md:grid-cols-[180px_1fr_180px] md:items-center">
        <Link
          href={`/products/${product.slug}`}
          className="relative mx-auto block aspect-square w-full max-w-[180px] overflow-hidden rounded-2xl bg-muted/40"
        >
          <Image
            src={getSafeImageSrc(product.images[0])}
            alt={product.name}
            fill
            className="object-cover"
          />
        </Link>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {product.categoryName ? (
              <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                {product.categoryName}
              </Badge>
            ) : null}
            {product.brandName ? (
              <Badge variant="secondary" className="rounded-full">
                {product.brandName}
              </Badge>
            ) : null}
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full">
                {tag}
              </Badge>
            ))}
          </div>

          <div>
            <Link href={`/products/${product.slug}`} className="text-xl font-semibold leading-7 hover:text-primary">
              {product.name}
            </Link>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {product.shortDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              {product.stockOnHand > 0 ? "En stock" : "Sur commande"}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
              Prix simple et visible
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
              {helperTag}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 rounded-[24px] bg-muted/35 p-4 md:items-end">
          <div className="w-full md:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Prix unitaire</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {formatTnd(product.retailPrice)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">TND clair, sans surprise</p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-medium transition hover:bg-muted"
            >
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
              quantity={quantity}
              label="Ajouter au panier"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
