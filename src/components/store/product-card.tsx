"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { PriceBlock } from "@/components/store/price-block";

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
  };
}) {
  const startingQuantity = Math.max(1, product.minimumOrderQuantity);

  return (
    <Card className="group overflow-hidden rounded-[32px] border-white/70 bg-white/95 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/55">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.images[0] ?? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          {product.tags[0] ? (
            <Badge className="rounded-full bg-white/90 text-slate-900 hover:bg-white/90">
              {product.tags[0]}
            </Badge>
          ) : (
            <span />
          )}
          <div className="rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-medium text-white">
            {product.stockOnHand > 0 ? "En stock" : "Sur commande"}
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-slate-950/75 px-4 py-3 text-white backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-white/65">Prix</p>
          <p className="mt-1 text-2xl font-semibold">{product.retailPrice.toFixed(3)} TND</p>
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
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            {product.stockOnHand} pieces
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            Des {startingQuantity} unites
          </span>
        </div>

        <PriceBlock
          primaryPrice={product.retailPrice}
          supportPrice={product.wholesalePrice}
        />

        <div className="flex items-center justify-between gap-3">
          <Link href={`/products/${product.slug}`} className="text-sm font-medium text-primary">
            Voir details
          </Link>
          <AddToCartButton sku={product.sku} quantity={startingQuantity} />
        </div>
      </CardContent>
    </Card>
  );
}
