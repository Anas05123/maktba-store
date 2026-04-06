"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export default function CartPage() {
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
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <div className="rounded-[34px] border border-white/70 bg-white/95 p-6 shadow-lg shadow-slate-200/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShoppingBag className="size-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-primary">Panier</p>
                <h1 className="text-4xl font-semibold text-slate-950">Votre panier</h1>
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              Revoyez vos articles, ajustez les quantites et confirmez facilement votre commande.
            </p>
          </div>

          {snapshot.lines.length > 0 ? (
            <Button variant="outline" className="rounded-full" onClick={clearCart}>
              Vider le panier
            </Button>
          ) : null}
        </div>

        <div className="mt-6 rounded-[28px] border border-primary/15 bg-primary/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Livraison offerte a partir de {formatTnd(FREE_SHIPPING_THRESHOLD)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {remainingForFreeShipping > 0
                  ? `Ajoutez ${formatTnd(remainingForFreeShipping)} pour en profiter.`
                  : "Votre livraison est offerte."}
              </p>
            </div>
            <Truck className="size-5 text-primary" />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5e9,#f59e0b)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            {
              icon: CreditCard,
              title: "Paiement a la livraison",
              text: "Une validation simple pour les parents.",
              tone: "border-amber-200/80 bg-amber-50/70",
            },
            {
              icon: PackageCheck,
              title: "Commande claire",
              text: "Panier, livraison et total visibles d'un coup d'oeil.",
              tone: "border-sky-200/80 bg-sky-50/70",
            },
            {
              icon: ShieldCheck,
              title: "Recapitulatif rassurant",
              text: "Les produits, quantites et montants restent faciles a verifier.",
              tone: "border-emerald-200/80 bg-emerald-50/70",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`flex items-center gap-3 rounded-[24px] border p-4 ${item.tone}`}
              >
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Icon className="size-4 text-slate-900" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="text-xs leading-5 text-slate-600">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {snapshot.lines.length === 0 ? (
            <Card className="rounded-[32px] border-white/70 bg-white/95 shadow-lg shadow-slate-200/30">
              <CardContent className="space-y-5 p-8 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShoppingBag className="size-7" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-950">Votre panier est vide</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Ajoutez quelques articles pour commencer votre commande.
                  </p>
                </div>
                <Link href="/catalog" className={cn(buttonVariants(), "rounded-full")}>
                  Explorer le catalogue
                </Link>
              </CardContent>
            </Card>
          ) : (
            snapshot.lines.map((line) => (
              <Card
                key={line.sku}
                className="rounded-[32px] border-white/70 bg-white/95 shadow-sm"
              >
                <CardContent className="p-5">
                  <div className="grid gap-5 md:grid-cols-[120px_1fr]">
                    <div className="relative aspect-square overflow-hidden rounded-[24px] bg-muted/40">
                      <Image
                        src={getSafeImageSrc(line.product.images[0])}
                        alt={line.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-4">
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

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1">
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
                          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                            {formatTnd(line.lineTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {recommendedProducts.length > 0 ? (
            <Card className="rounded-[32px] border-amber-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,248,222,0.95))] shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" />
                  <p className="text-sm font-semibold text-slate-950">
                    Suggestions pour completer votre panier
                  </p>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {recommendedProducts.map((product) => (
                    <Link
                      key={product.sku}
                      href={`/products/${product.slug}`}
                      className="rounded-[24px] bg-white p-4 shadow-sm transition hover:-translate-y-0.5"
                    >
                      <p className="font-medium text-slate-950">{product.name}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{formatTnd(product.retailPrice)}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                        Voir
                        <ArrowRight className="size-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="sticky top-24 h-fit rounded-[32px] border-0 bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
          <CardContent className="space-y-5 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/55">Resume commande</p>
              <h2 className="mt-2 text-2xl font-semibold">Total de votre panier</h2>
            </div>

            <div className="space-y-3 rounded-[28px] border border-white/10 bg-white/5 p-5">
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

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white/75">
              Paiement a la livraison, prix en TND et recapitulatif simple avant la confirmation finale.
            </div>

            <div className="grid gap-3">
              <Link
                href="/checkout"
                className={cn(
                  buttonVariants(),
                  "h-11 w-full rounded-full bg-white text-slate-950 hover:bg-slate-100",
                )}
              >
                Continuer vers checkout
              </Link>
              <Link
                href="/catalog"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Continuer mes achats
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
