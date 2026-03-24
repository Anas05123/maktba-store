import type { DemoProduct } from "@/data/demo-store";

export function getWholesaleUnitPrice(product: DemoProduct, quantity: number) {
  const tier = [...product.priceTiers]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find(
      (candidate) =>
        quantity >= candidate.minQuantity &&
        (candidate.maxQuantity === undefined || quantity <= candidate.maxQuantity),
    );

  return tier?.price ?? product.wholesalePrice;
}

export function getCustomerUnitPrice(product: DemoProduct, quantity: number) {
  const tier = [...product.priceTiers]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find(
      (candidate) =>
        quantity >= candidate.minQuantity &&
        (candidate.maxQuantity === undefined || quantity <= candidate.maxQuantity),
    );

  return Math.min(product.retailPrice, tier?.price ?? product.retailPrice);
}

export function calculateMargin(unitPrice: number, costPrice: number) {
  return ((unitPrice - costPrice) / unitPrice) * 100;
}

export function calculateOrderTotals(
  items: Array<{ product: DemoProduct; quantity: number }>,
  shippingFee = 0,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + getCustomerUnitPrice(item.product, item.quantity) * item.quantity,
    0,
  );
  const costTotal = items.reduce(
    (sum, item) => sum + item.product.costPrice * item.quantity,
    0,
  );

  return {
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    costTotal,
    estimatedProfit: subtotal + shippingFee - costTotal,
  };
}
