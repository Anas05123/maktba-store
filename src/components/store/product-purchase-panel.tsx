"use client";

import { Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PriceBlock } from "@/components/store/price-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type CartProductSnapshot, useCartStore } from "@/store/cart-store";

export function ProductPurchasePanel({
  product,
  compareAtPrice,
  unit,
  packSize,
}: {
  product: CartProductSnapshot;
  compareAtPrice?: number;
  unit: string;
  packSize: number;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const deliveryNote = useMemo(() => {
    if (product.stockOnHand <= 0) {
      return "Disponible sur reapprovisionnement, avec confirmation apres commande.";
    }

    if (product.stockOnHand <= 8) {
      return "Petit stock disponible, commandez rapidement si ce produit vous interesse.";
    }

    return "Expedition rapide selon disponibilite et paiement a la livraison en Tunisie.";
  }, [product.stockOnHand]);

  return (
    <div className="space-y-5 rounded-[36px] border border-white/70 bg-white/92 p-8 shadow-lg shadow-slate-200/30">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          {product.stockOnHand > 0 ? "En stock" : "Disponible sur demande"}
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          Prix en TND
        </Badge>
        <Badge variant="outline" className="rounded-full">
          Paiement a la livraison
        </Badge>
      </div>

      <PriceBlock
        primaryPrice={product.retailPrice}
        helperText="Prix retail TTC, en dinars tunisiens"
        highlightText={
          product.retailPrice <= 15
            ? "Petit budget pour la rentree"
            : "Bon choix pour les parents"
        }
      />

      {compareAtPrice && compareAtPrice > product.retailPrice ? (
        <p className="text-sm text-muted-foreground">
          Au lieu de{" "}
          <span className="font-medium line-through">
            {compareAtPrice.toFixed(3)} TND
          </span>
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] bg-muted/55 p-4">
          <p className="text-sm text-muted-foreground">Conditionnement</p>
          <p className="mt-2 font-semibold capitalize">
            {packSize > 1 ? `${packSize} ${unit}s` : `1 ${unit}`}
          </p>
        </div>
        <div className="rounded-[24px] bg-muted/55 p-4">
          <p className="text-sm text-muted-foreground">Ajout rapide</p>
          <p className="mt-2 font-semibold">1 article</p>
        </div>
        <div className="rounded-[24px] bg-muted/55 p-4">
          <p className="text-sm text-muted-foreground">Disponibilite</p>
          <p className="mt-2 font-semibold">{product.stockOnHand} article(s)</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">Choisissez la quantite</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajustez simplement avant d&apos;ajouter au panier.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-white px-2 py-1.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() =>
                setQuantity((current) =>
                  product.stockOnHand > 0
                    ? Math.min(product.stockOnHand, current + 1)
                    : current + 1,
                )
              }
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full rounded-full"
        onClick={() => {
          addItem(product, quantity);
          toast.success("Produit ajoute au panier");
        }}
      >
        <ShoppingCart className="size-4" />
        Ajouter {quantity > 1 ? `${quantity} articles` : "au panier"}
      </Button>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[24px] border border-sky-200/80 bg-sky-50/80 p-4">
          <div className="flex items-center gap-2 text-slate-950">
            <Truck className="size-4 text-primary" />
            <p className="font-semibold">Livraison Tunisie</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{deliveryNote}</p>
        </div>
        <div className="rounded-[24px] border border-emerald-200/80 bg-emerald-50/80 p-4">
          <div className="flex items-center gap-2 text-slate-950">
            <ShieldCheck className="size-4 text-emerald-600" />
            <p className="font-semibold">Commande rassurante</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Recapitulatif clair, paiement a la livraison et espace client pour suivre vos commandes.
          </p>
        </div>
      </div>
    </div>
  );
}
