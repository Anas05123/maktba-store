"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { type CartProductSnapshot, useCartStore } from "@/store/cart-store";

export function AddToCartButton({
  product,
  label = "Ajouter au panier",
  quantity = 1,
}: {
  product: CartProductSnapshot;
  label?: string;
  quantity?: number;
}) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      onClick={() => {
        addItem(product, quantity);
        toast.success("Produit ajoute au panier");
      }}
      className="rounded-full"
    >
      <ShoppingCart className="size-4" />
      {label}
    </Button>
  );
}
