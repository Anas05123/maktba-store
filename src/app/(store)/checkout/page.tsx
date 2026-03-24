"use client";

import { CheckoutForm } from "@/components/forms/checkout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTnd } from "@/lib/format";
import { getCartSnapshot, useCartStore } from "@/store/cart-store";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const snapshot = getCartSnapshot(items);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Checkout Tunisie
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Livraison, COD et details de contact</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <CheckoutForm />

        <Card className="rounded-[28px] border-white/70 bg-white/90">
          <CardHeader>
            <CardTitle>Resume financier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.lines.map((line) => (
              <div key={line.sku} className="flex items-center justify-between text-sm">
                <span>{line.product.name}</span>
                <span>{formatTnd(line.lineTotal)}</span>
              </div>
            ))}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
