"use client";

import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTnd } from "@/lib/format";

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
    brandName?: string;
    categoryName?: string;
  };
}) {
  const quantity = Math.max(1, product.minimumOrderQuantity);

  return (
    <Card className="overflow-hidden rounded-[28px] border-white/70 bg-white/95 shadow-sm transition hover:shadow-lg">
      <div className="grid gap-4 p-4 md:grid-cols-[180px_1fr_180px] md:items-center">
        <Link
          href={`/products/${product.slug}`}
          className="relative mx-auto block aspect-square w-full max-w-[180px] overflow-hidden rounded-2xl bg-muted/40"
        >
          <Image
            src={
              product.images[0] ??
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
            }
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
              Des {quantity} pieces
            </span>
            {product.wholesalePrice < product.retailPrice ? (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                Pack malin disponible
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 rounded-[24px] bg-muted/35 p-4 md:items-end">
          <div className="w-full md:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Prix</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {formatTnd(product.retailPrice)}
            </p>
            {product.wholesalePrice < product.retailPrice ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Pack {formatTnd(product.wholesalePrice)}
              </p>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-4 text-sm font-medium transition hover:bg-muted"
            >
              Voir le produit
            </Link>
            <AddToCartButton sku={product.sku} quantity={quantity} />
          </div>
        </div>
      </div>
    </Card>
  );
}
