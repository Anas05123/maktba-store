"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { featuredProducts } from "@/lib/demo-data";
import { formatTnd } from "@/lib/format";
import { getSafeImageSrc } from "@/lib/images";
import {
  FREE_SHIPPING_THRESHOLD,
  getCartSnapshot,
  useCartStore,
} from "@/store/cart-store";
import { cn } from "@/lib/utils";

export function CartSheet({ onNavigate }: { onNavigate?: () => void }) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const snapshot = getCartSnapshot(items);

  const remainingForFreeShipping =
    snapshot.lines.length === 0
      ? FREE_SHIPPING_THRESHOLD
      : Math.max(FREE_SHIPPING_THRESHOLD - snapshot.subtotal, 0);
  const progress =
    snapshot.lines.length === 0
      ? 0
      : Math.min((snapshot.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const recommendedProducts = featuredProducts
    .filter((product) => !snapshot.lines.some((line) => line.sku === product.sku))
    .slice(0, 2);
  const linkCloseProps = onNavigate
    ? {
        onClick: () => {
          onNavigate();
        },
      }
    : {};

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#fffdf8_0%,#f8fbff_45%,#ffffff_100%)]">
      <div className="space-y-3 border-b border-border/60 bg-white/85 px-5 pb-3 pt-4 backdrop-blur-sm sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#e0f2fe,#fff7ed)] text-primary shadow-sm">
                <ShoppingBag className="size-5" />
              </div>
              <div>
                <h2 className="text-[2rem] font-semibold tracking-tight text-slate-950">
                  Votre panier
                </h2>
                <p className="text-sm text-muted-foreground">
                  {snapshot.lines.length} article{snapshot.lines.length > 1 ? "s" : ""} selectionne
                  {snapshot.lines.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              Verifiez vos articles, ajustez les quantites puis passez a la caisse sans complication.
            </p>
          </div>

          {snapshot.lines.length > 0 ? (
            <button
              type="button"
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-rose-50 hover:text-destructive"
              onClick={clearCart}
            >
              Vider
            </button>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-primary/15 bg-[linear-gradient(135deg,rgba(236,254,255,1),rgba(239,246,255,1))] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Livraison offerte a partir de {formatTnd(FREE_SHIPPING_THRESHOLD)}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {remainingForFreeShipping > 0
                  ? `Ajoutez ${formatTnd(remainingForFreeShipping)} pour profiter de la livraison offerte.`
                  : "Bravo, votre livraison est offerte."}
              </p>
            </div>
            <Truck className="size-5 shrink-0 text-primary" />
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/90 shadow-inner">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#0284c7,#f59e0b)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-h-0 overflow-y-auto px-5 py-4 sm:px-7">
          {snapshot.lines.length === 0 ? (
          <div className="space-y-5 rounded-[30px] border border-dashed border-border bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="size-7" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-950">Votre panier est vide</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ajoutez quelques fournitures pour demarrer votre commande.
              </p>
            </div>
            <Link
              href="/catalog"
              className={cn(buttonVariants(), "rounded-full")}
              {...linkCloseProps}
            >
              Explorer le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {snapshot.lines.map((line) => (
              <div
                key={line.sku}
                className="rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-5"
              >
                <div className="grid gap-4 sm:grid-cols-[104px_1fr]">
                  <div className="relative aspect-square overflow-hidden rounded-[22px] bg-muted/40 shadow-inner">
                    <Image
                      src={getSafeImageSrc(line.product.images[0])}
                      alt={line.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="line-clamp-2 text-lg font-semibold text-slate-950">
                          {line.product.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {line.product.categoryName} - {formatTnd(line.unitPrice)} / article
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full p-2 text-muted-foreground transition hover:bg-rose-50 hover:text-destructive"
                        onClick={() => removeItem(line.sku)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 shadow-sm">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-full"
                          onClick={() => updateQuantity(line.sku, line.quantity - 1)}
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="min-w-8 text-center text-sm font-medium">
                          {line.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-full"
                          onClick={() => updateQuantity(line.sku, line.quantity + 1)}
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Total ligne
                        </p>
                        <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                          {formatTnd(line.lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {recommendedProducts.length > 0 ? (
              <div className="space-y-3 rounded-[30px] border border-amber-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,248,222,0.95))] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" />
                  <p className="text-sm font-semibold text-slate-950">Ajoutez aussi</p>
                </div>
                <div className="grid gap-3">
                  {recommendedProducts.map((product) => (
                    <Link
                      key={product.sku}
                      href={`/products/${product.slug}`}
                      className="flex items-center justify-between gap-3 rounded-[22px] bg-white/90 px-4 py-3 shadow-sm transition hover:-translate-y-0.5"
                      {...linkCloseProps}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 overflow-hidden rounded-2xl bg-slate-100">
                          <Image
                            src={getSafeImageSrc(product.images[0])}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-950">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTnd(product.retailPrice)}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="size-4 text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          )}
        </div>

        <div className="hidden border-l border-border/60 bg-slate-50/80 p-5 lg:block">
          <div className="sticky top-5 rounded-[30px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-white/75">
                <span>Sous-total</span>
                <span>{formatTnd(snapshot.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-white/75">
                <span>Livraison</span>
                <span>{snapshot.shipping === 0 ? "Offerte" : formatTnd(snapshot.shipping)}</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatTnd(snapshot.total)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/70">
              <ShieldCheck className="size-4 text-emerald-300" />
              Panier securise, validation simple et recapitulatif clair avant paiement.
            </div>

            <div className="mt-4 grid gap-3">
              {snapshot.lines.length > 0 ? (
                <>
                  <Link
                    href="/checkout"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full rounded-full bg-white text-slate-950 hover:bg-slate-100",
                    )}
                    {...linkCloseProps}
                  >
                    Passer la commande
                  </Link>
                  <Link
                    href="/cart"
                    className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-medium text-white transition hover:bg-white/10"
                    {...linkCloseProps}
                  >
                    Voir le panier complet
                  </Link>
                </>
              ) : (
                <Button disabled className="h-11 w-full rounded-full">
                  Ajoutez un produit pour continuer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-border/70 bg-white/95 px-5 py-4 shadow-[0_-18px_45px_rgba(15,23,42,0.05)] sm:px-7 lg:hidden">
        <div className="rounded-[30px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-white/75">
              <span>Sous-total</span>
              <span>{formatTnd(snapshot.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/75">
              <span>Livraison</span>
              <span>{snapshot.shipping === 0 ? "Offerte" : formatTnd(snapshot.shipping)}</span>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatTnd(snapshot.total)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/70">
            <ShieldCheck className="size-4 text-emerald-300" />
            Panier securise, validation simple et recapitulatif clair avant paiement.
          </div>

          <div className="mt-4 grid gap-3">
            {snapshot.lines.length > 0 ? (
              <>
                <Link
                  href="/checkout"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full rounded-full bg-white text-slate-950 hover:bg-slate-100",
                  )}
                  {...linkCloseProps}
                >
                  Passer la commande
                </Link>
                <Link
                  href="/cart"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-medium text-white transition hover:bg-white/10"
                  {...linkCloseProps}
                >
                  Voir le panier complet
                </Link>
              </>
            ) : (
              <Button disabled className="h-11 w-full rounded-full">
                Ajoutez un produit pour continuer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
