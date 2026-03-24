"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({
  sku,
  label = "Ajouter au panier",
  quantity = 1,
}: {
  sku: string;
  label?: string;
  quantity?: number;
}) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      onClick={() => {
        addItem(sku, quantity);
        toast.success("Produit ajoute au panier");
      }}
      className="rounded-full"
    >
      <ShoppingCart className="size-4" />
      {label}
    </Button>
  );
}
