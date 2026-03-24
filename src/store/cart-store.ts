"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { products } from "@/lib/demo-data";
import { getCustomerUnitPrice } from "@/lib/wholesale";

type CartItem = {
  sku: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (sku: string, quantity?: number) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (sku, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.sku === sku);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.sku === sku
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          return { items: [...state.items, { sku, quantity }] };
        }),
      updateQuantity: (sku, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.sku !== sku)
              : state.items.map((item) =>
                  item.sku === sku ? { ...item, quantity } : item,
                ),
        })),
      removeItem: (sku) =>
        set((state) => ({
          items: state.items.filter((item) => item.sku !== sku),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "maktba-cart" },
  ),
);

export const FREE_SHIPPING_THRESHOLD = 120;

export function getCartSnapshot(items: CartItem[]) {
  const lines = items.flatMap((item) => {
    const product = products.find((entry) => entry.sku === item.sku);
    if (!product) return [];
    const unitPrice = getCustomerUnitPrice(product, item.quantity);
    return [
      {
        ...item,
        product,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      },
    ];
  });

  const subtotal = lines.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = lines.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 12;

  return {
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}
