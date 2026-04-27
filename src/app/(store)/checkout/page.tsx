"use client";

import { CreditCard, MapPinned, PackageCheck, ReceiptText } from "lucide-react";

import { CheckoutForm } from "@/components/forms/checkout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTnd } from "@/lib/format";
import { getCartSnapshot, useCartStore } from "@/store/cart-store";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const snapshot = getCartSnapshot(items);

  return (
    <div className="w-full space-y-8 px-4 py-10 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Livraison Tunisie
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Finaliser votre commande en toute simplicite</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Renseignez vos coordonnees, choisissez la livraison en Tunisie et confirmez votre panier en quelques instants.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Prix en TND",
              description: "Tous les montants sont affiches clairement en dinars tunisiens.",
              icon: ReceiptText,
            },
            {
              title: "Paiement a la livraison",
              description: "Vous reglez a la reception pour une commande plus rassurante.",
              icon: CreditCard,
            },
            {
              title: "Livraison partout en Tunisie",
              description: "Adresse claire, numero joignable et suivi simple apres validation.",
              icon: MapPinned,
            },
            {
              title: "Recapitulatif clair",
              description: "Sous-total, livraison et total sont visibles avant confirmation.",
              icon: PackageCheck,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[26px] border border-amber-100 bg-[linear-gradient(180deg,#fffdf6_0%,#ffffff_100%)] p-5 shadow-sm"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 text-base font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: PackageCheck,
            title: "Panier verifie",
            description: "Revoyez rapidement vos articles avant validation.",
          },
          {
            icon: MapPinned,
            title: "Adresse claire",
            description: "Ajoutez votre ville et un point de repere utile au livreur.",
          },
          {
            icon: CreditCard,
            title: "Paiement simple",
            description: "Le paiement a la livraison reste disponible sur toute la Tunisie.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-sm"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <CheckoutForm />

        <Card className="rounded-[28px] border-white/70 bg-white/95 lg:sticky lg:top-24">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ReceiptText className="size-5" />
              </div>
              <div>
                <CardTitle>Resume de votre commande</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Un recapitulatif clair avant la validation finale.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {snapshot.lines.map((line) => (
                <div
                  key={line.sku}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-950">{line.product.name}</p>
                    <p className="text-xs text-muted-foreground">Quantite: {line.quantity}</p>
                  </div>
                  <span className="font-medium text-slate-950">{formatTnd(line.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Sous-total</span>
              <span>{formatTnd(snapshot.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Livraison</span>
              <span>{snapshot.shipping === 0 ? "Offerte" : formatTnd(snapshot.shipping)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total TTC</span>
              <span>{formatTnd(snapshot.total)}</span>
            </div>
            <div className="rounded-2xl border border-dashed border-primary/25 bg-primary/5 p-4 text-sm text-muted-foreground">
              Paiement a la livraison disponible, prix en TND et livraison partout en Tunisie.
            </div>
            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4 text-sm text-slate-700">
              Votre recu et votre suivi de commande seront disponibles dans votre espace client apres confirmation.
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-700">
              Une fois la commande validee, nous preparons vos articles puis nous vous contactons pour la livraison.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
