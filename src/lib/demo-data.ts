import {
  demoBrands,
  demoCategories,
  demoCustomers,
  demoExpenses,
  demoOrders,
  demoProducts,
  demoSuppliers,
  type DemoProduct,
} from "@/data/demo-store";
import { calculateMargin, getCustomerUnitPrice } from "@/lib/wholesale";

export const categories = demoCategories;

const brandBySlug = new Map(demoBrands.map((brand) => [brand.slug, brand.name]));

export const products = demoProducts.map((product) => {
  const category = demoCategories.find((item) => item.slug === product.categorySlug)!;
  const supplier = demoSuppliers.find(
    (item) => item.code === product.preferredSupplierCode,
  )!;
  const margin = calculateMargin(product.wholesalePrice, product.costPrice);

  return {
    ...product,
    brandName: brandBySlug.get(product.brandSlug) ?? product.brandSlug,
    categoryName: category.name,
    categoryDescription: category.description,
    supplierName: supplier.name,
    supplierCity: supplier.city,
    margin,
  };
});

export const featuredProducts = products.filter((product) => product.isFeatured);

export const lowStockProducts = products.filter(
  (product) => product.stockOnHand <= product.lowStockThreshold,
);

export const customers = demoCustomers;
export const suppliers = demoSuppliers;

export const orders = demoOrders.map((order) => {
  const customer = demoCustomers.find((item) => item.code === order.customerCode)!;
  const lineItems = order.items.map((item) => {
    const product = products.find((entry) => entry.sku === item.sku)!;
    return {
      ...item,
      product,
      total: item.quantity * item.unitPrice,
      margin: (item.unitPrice - item.unitCost) * item.quantity,
    };
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const costTotal = lineItems.reduce(
    (sum, item) => sum + item.unitCost * item.quantity,
    0,
  );
  const total = subtotal + order.shippingFee;

  return {
    ...order,
    customer,
    lineItems,
    subtotal,
    total,
    costTotal,
    estimatedProfit: total - costTotal,
  };
});

export const expenses = demoExpenses;

export const dashboardSummary = {
  revenue: orders.reduce((sum, order) => sum + order.total, 0),
  profit: orders.reduce((sum, order) => sum + order.estimatedProfit, 0),
  expenses: expenses.reduce((sum, item) => sum + item.amount, 0),
  orders: orders.length,
  customers: customers.length,
  avgOrderValue:
    orders.reduce((sum, order) => sum + order.total, 0) / Math.max(orders.length, 1),
  lowStockItems: lowStockProducts.length,
};

export const monthlyPerformance = [
  { month: "Jan", revenue: 19420, profit: 4820, expenses: 3120 },
  { month: "Fev", revenue: 24180, profit: 6310, expenses: 3380 },
  { month: "Mar", revenue: dashboardSummary.revenue, profit: dashboardSummary.profit, expenses: dashboardSummary.expenses },
];

export const orderStatusBreakdown = [
  { status: "Pending", total: orders.filter((order) => order.status === "PENDING").length },
  { status: "Confirmed", total: orders.filter((order) => order.status === "CONFIRMED").length },
  { status: "Picking", total: orders.filter((order) => order.status === "PICKING").length },
  {
    status: "In transit",
    total: orders.filter((order) =>
      ["READY_FOR_DELIVERY", "SHIPPED"].includes(order.status),
    ).length,
  },
  { status: "Delivered", total: orders.filter((order) => order.status === "DELIVERED").length },
];

export const expenseBreakdown = [
  { category: "Rent", amount: expenses.filter((item) => item.category === "RENT").reduce((sum, item) => sum + item.amount, 0) },
  { category: "Logistics", amount: expenses.filter((item) => item.category === "LOGISTICS").reduce((sum, item) => sum + item.amount, 0) },
  { category: "Marketing", amount: expenses.filter((item) => item.category === "MARKETING").reduce((sum, item) => sum + item.amount, 0) },
  { category: "Operations", amount: expenses.filter((item) => item.category === "OPERATIONS").reduce((sum, item) => sum + item.amount, 0) },
  { category: "Utilities", amount: expenses.filter((item) => item.category === "UTILITIES").reduce((sum, item) => sum + item.amount, 0) },
];

export const topProducts = products
  .map((product) => {
    const quantitySold = orders
      .flatMap((order) => order.lineItems)
      .filter((item) => item.sku === product.sku)
      .reduce((sum, item) => sum + item.quantity, 0);

    return {
      ...product,
      quantitySold,
      revenue: quantitySold * getCustomerUnitPrice(product as DemoProduct, quantitySold || 1),
    };
  })
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

export const inventoryOverview = products.map((product) => ({
  sku: product.sku,
  product: product.name,
  category: product.categoryName,
  onHand: product.stockOnHand,
  threshold: product.lowStockThreshold,
  coverageDays: Math.max(Math.floor(product.stockOnHand / 6), 4),
  supplier: product.supplierName,
}));

export const financeReport = {
  grossRevenue: dashboardSummary.revenue,
  grossProfit: dashboardSummary.profit,
  operatingExpenses: dashboardSummary.expenses,
  netProfit: dashboardSummary.profit - dashboardSummary.expenses,
};

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.categorySlug === slug);
}
