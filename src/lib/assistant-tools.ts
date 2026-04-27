import "server-only";

import { getAccessibleOrderByNumber, getCurrentUserOrders } from "@/lib/account-data";
import { getOrderRecords, getProductRecords } from "@/lib/admin/cms";
import { formatDate, formatTnd } from "@/lib/format";
import { getStorefrontApiData } from "@/lib/storefront";

type AssistantRole = "GUEST" | "CUSTOMER" | "ADMIN" | "MANAGER" | "STAFF";

export type AssistantLink = { label: string; href: string };
export type AssistantToolResult = { output: unknown; links?: AssistantLink[] };

type ToolContext = {
  role: AssistantRole;
  userId?: string | null;
  customerId?: string | null;
  email?: string | null;
  name?: string | null;
};

const opsRoles = new Set<AssistantRole>(["ADMIN", "MANAGER", "STAFF"]);

function canUseOps(role: AssistantRole) {
  return opsRoles.has(role);
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseLimit(value: unknown, fallback: number, max: number) {
  const numeric = Number(value ?? fallback);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(Math.max(Math.trunc(numeric), 1), max);
}

function parseOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function scoreMatch(haystack: string, terms: string[]) {
  return terms.reduce((score, term) => (haystack.includes(term) ? score + 2 : score), 0);
}

function findProduct(catalog: Awaited<ReturnType<typeof getStorefrontApiData>>, identifier: string) {
  const needle = normalizeText(identifier);
  return (
    catalog.products.find((product) =>
      normalizeText(`${product.slug} ${product.sku} ${product.barcode ?? ""} ${product.name}`).includes(
        needle,
      ),
    ) ?? null
  );
}

function summarizeProduct(
  product: Awaited<ReturnType<typeof getStorefrontApiData>>["products"][number],
) {
  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: product.categoryName,
    price: formatTnd(product.retailPrice),
    compareAtPrice: product.compareAtPrice ? formatTnd(product.compareAtPrice) : null,
    stockOnHand: product.stockOnHand,
    shortDescription: product.shortDescription,
    packSize: product.packSize,
    minimumOrderQuantity: product.minimumOrderQuantity,
  };
}

function rankProducts(
  catalog: Awaited<ReturnType<typeof getStorefrontApiData>>,
  query: string,
  category?: string | null,
  budgetMax?: number | null,
) {
  const terms = normalizeText(query).split(" ").filter((term) => term.length > 1);
  const categoryNeedle = normalizeText(category ?? "");

  return catalog.products
    .map((product) => {
      const haystack = normalizeText(
        [
          product.name,
          product.shortDescription,
          product.description,
          product.categoryName,
          product.categorySlug,
          product.tags.join(" "),
          product.brandName ?? "",
          product.sku,
          product.barcode ?? "",
        ].join(" "),
      );

      let score = scoreMatch(haystack, terms);
      if (categoryNeedle && normalizeText(`${product.categoryName} ${product.categorySlug}`).includes(categoryNeedle)) {
        score += 4;
      }
      if (budgetMax && product.retailPrice <= budgetMax) {
        score += 1;
      }

      return { product, score };
    })
    .filter(({ product, score }) => score > 0 || (!terms.length && product.isFeatured))
    .filter(({ product }) => !budgetMax || product.retailPrice <= budgetMax)
    .sort((left, right) => right.score - left.score || Number(right.product.isFeatured) - Number(left.product.isFeatured));
}

export function getAssistantTools(role: AssistantRole) {
  const tools: Array<Record<string, unknown>> = [
    {
      type: "function",
      name: "search_products",
      description: "Search the catalog for school-supply products from a shopper request.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "What the user wants to find." },
          limit: { type: "integer", minimum: 1, maximum: 8 },
        },
        required: ["query"],
        additionalProperties: false,
      },
      strict: false,
    },
    {
      type: "function",
      name: "recommend_products",
      description: "Recommend products using shopper intent, optional category, and optional budget.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          category: { type: "string" },
          budgetMax: { type: "number" },
          limit: { type: "integer", minimum: 1, maximum: 8 },
        },
        required: ["query"],
        additionalProperties: false,
      },
      strict: false,
    },
    {
      type: "function",
      name: "browse_categories",
      description: "Browse main storefront categories and optionally filter them by topic.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          limit: { type: "integer", minimum: 1, maximum: 8 },
        },
        additionalProperties: false,
      },
      strict: false,
    },
    {
      type: "function",
      name: "get_product_details",
      description: "Get detailed product information by slug, SKU, barcode, or product name.",
      parameters: {
        type: "object",
        properties: {
          identifier: { type: "string" },
        },
        required: ["identifier"],
        additionalProperties: false,
      },
      strict: false,
    },
    {
      type: "function",
      name: "get_school_packs",
      description: "List back-to-school packs and ready-made selections.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, maximum: 8 },
        },
        additionalProperties: false,
      },
      strict: false,
    },
    {
      type: "function",
      name: "get_store_policies",
      description: "Answer store questions about TND pricing, delivery in Tunisia, and cash on delivery.",
      parameters: {
        type: "object",
        properties: {
          topic: { type: "string" },
        },
        additionalProperties: false,
      },
      strict: false,
    },
    {
      type: "function",
      name: "get_my_orders",
      description: "Return the signed-in user's own recent orders.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, maximum: 6 },
        },
        additionalProperties: false,
      },
      strict: false,
    },
    {
      type: "function",
      name: "get_my_order_status",
      description: "Look up one order number for the signed-in user.",
      parameters: {
        type: "object",
        properties: {
          orderNumber: { type: "string" },
        },
        required: ["orderNumber"],
        additionalProperties: false,
      },
      strict: false,
    },
  ];

  if (canUseOps(role)) {
    tools.push(
      {
        type: "function",
        name: "get_non_shipped_orders",
        description: "Return recent orders that have not yet shipped.",
        parameters: {
          type: "object",
          properties: { limit: { type: "integer", minimum: 1, maximum: 10 } },
          additionalProperties: false,
        },
        strict: false,
      },
      {
        type: "function",
        name: "get_low_stock_products",
        description: "Return products that are at or below their low-stock threshold.",
        parameters: {
          type: "object",
          properties: { limit: { type: "integer", minimum: 1, maximum: 10 } },
          additionalProperties: false,
        },
        strict: false,
      },
      {
        type: "function",
        name: "get_pending_orders",
        description: "Return orders that still need processing.",
        parameters: {
          type: "object",
          properties: { limit: { type: "integer", minimum: 1, maximum: 10 } },
          additionalProperties: false,
        },
        strict: false,
      },
      {
        type: "function",
        name: "get_recent_orders",
        description: "Return recent live orders, optionally filtered by status.",
        parameters: {
          type: "object",
          properties: {
            limit: { type: "integer", minimum: 1, maximum: 12 },
            status: { type: "string" },
          },
          additionalProperties: false,
        },
        strict: false,
      },
      {
        type: "function",
        name: "get_sales_summary",
        description: "Get a short sales summary for the last N days.",
        parameters: {
          type: "object",
          properties: {
            days: { type: "integer", minimum: 1, maximum: 365 },
          },
          additionalProperties: false,
        },
        strict: false,
      },
    );
  }

  return tools;
}

export async function executeAssistantTool(
  name: string,
  rawArguments: string,
  context: ToolContext,
): Promise<AssistantToolResult> {
  let args: Record<string, unknown> = {};

  try {
    args = rawArguments ? (JSON.parse(rawArguments) as Record<string, unknown>) : {};
  } catch {
    args = {};
  }

  switch (name) {
    case "search_products": {
      const query = String(args.query ?? "").trim();
      const limit = parseLimit(args.limit, 5, 8);
      const catalog = await getStorefrontApiData();
      const products = rankProducts(catalog, query).slice(0, limit).map(({ product }) => product);

      return {
        output: { query, count: products.length, products: products.map(summarizeProduct) },
        links: products.map((product) => ({ label: product.name, href: `/products/${product.slug}` })),
      };
    }

    case "recommend_products": {
      const query = String(args.query ?? "").trim();
      const category = String(args.category ?? "").trim() || null;
      const budgetMax = parseOptionalNumber(args.budgetMax);
      const limit = parseLimit(args.limit, 4, 8);
      const catalog = await getStorefrontApiData();
      const products = rankProducts(catalog, query, category, budgetMax)
        .slice(0, limit)
        .map(({ product }) => product);

      return {
        output: {
          query,
          category,
          budgetMax,
          count: products.length,
          products: products.map((product) => ({
            ...summarizeProduct(product),
            benefit: product.packSize > 1 ? `Pack pratique de ${product.packSize}` : "Choix simple pour la rentree",
          })),
        },
        links: products.map((product) => ({ label: product.name, href: `/products/${product.slug}` })),
      };
    }

    case "browse_categories": {
      const query = String(args.query ?? "").trim();
      const limit = parseLimit(args.limit, 6, 8);
      const catalog = await getStorefrontApiData();
      const terms = normalizeText(query).split(" ").filter((term) => term.length > 1);
      const categories = catalog.categories
        .map((category) => ({
          category,
          score: terms.length ? scoreMatch(normalizeText(`${category.name} ${category.description} ${category.slug}`), terms) : 1,
        }))
        .filter(({ score }) => score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, limit)
        .map(({ category }) => category);

      return {
        output: {
          query: query || null,
          count: categories.length,
          categories: categories.map((category) => ({
            name: category.name,
            slug: category.slug,
            description: category.description,
            productCount: catalog.products.filter((product) => product.categorySlug === category.slug).length,
          })),
        },
        links: categories.map((category) => ({ label: category.name, href: `/categories/${category.slug}` })),
      };
    }

    case "get_product_details": {
      const identifier = String(args.identifier ?? "").trim();
      const catalog = await getStorefrontApiData();
      const product = findProduct(catalog, identifier);

      return {
        output: product
          ? {
              found: true,
              product: {
                ...summarizeProduct(product),
                barcode: product.barcode ?? null,
                description: product.description,
                specifications: product.specifications ?? {},
                variants: product.variants ?? [],
                priceTiers: product.priceTiers,
              },
            }
          : { found: false, message: "No matching product was found." },
        links: product
          ? [
              { label: `Open ${product.name}`, href: `/products/${product.slug}` },
              { label: `More in ${product.categoryName}`, href: `/categories/${product.categorySlug}` },
            ]
          : [],
      };
    }

    case "get_school_packs": {
      const limit = parseLimit(args.limit, 5, 8);
      const catalog = await getStorefrontApiData();
      const packs = catalog.products
        .filter((product) =>
          normalizeText(`${product.name} ${product.shortDescription} ${product.description} ${product.categoryName}`).includes("pack"),
        )
        .slice(0, limit);

      return {
        output: { count: packs.length, packs: packs.map(summarizeProduct) },
        links: packs.map((product) => ({ label: product.name, href: `/products/${product.slug}` })),
      };
    }

    case "get_store_policies":
      return {
        output: {
          topic: String(args.topic ?? "").trim(),
          policies: {
            currency: "Prices are shown in TND.",
            payment: "Cash on delivery is available in Tunisia.",
            delivery: "Delivery is available across Tunisia.",
            trustSignals: [
              "Prix en TND",
              "Paiement a la livraison",
              "Livraison partout en Tunisie",
              "Recapitulatif clair avant validation",
            ],
          },
        },
        links: [
          { label: "Open checkout", href: "/checkout" },
          { label: "Browse catalog", href: "/catalog" },
        ],
      };

    case "get_my_orders": {
      if (!context.userId && !context.customerId && !context.email) {
        return {
          output: { error: "Authentication required.", message: "The user must sign in to access personal orders." },
          links: [{ label: "Open account", href: "/account" }],
        };
      }

      const limit = parseLimit(args.limit, 4, 6);
      const orders = await getCurrentUserOrders();

      return {
        output: {
          count: orders.length,
          orders: orders.slice(0, limit).map((order) => ({
            orderNumber: order.orderNumber,
            placedAt: formatDate(order.placedAt),
            status: order.statusLabel,
            paymentStatus: order.paymentStatusLabel,
            deliveryStatus: order.deliveryStatusLabel,
            total: formatTnd(order.total),
            items: order.items.map((item) => item.name).slice(0, 4),
          })),
        },
        links: [{ label: "Open my orders", href: "/account/orders" }],
      };
    }

    case "get_my_order_status": {
      if (!context.userId && !context.customerId && !context.email) {
        return {
          output: { error: "Authentication required.", message: "The user must sign in to access personal orders." },
          links: [{ label: "Open account", href: "/account" }],
        };
      }

      const orderNumber = String(args.orderNumber ?? "").trim();
      const order = await getAccessibleOrderByNumber(orderNumber);

      return {
        output: order
          ? {
              found: true,
              order: {
                orderNumber: order.orderNumber,
                placedAt: formatDate(order.placedAt),
                status: order.statusLabel,
                paymentStatus: order.paymentStatusLabel,
                deliveryStatus: order.deliveryStatusLabel,
                fulfillmentStatus: order.fulfillmentStatusLabel,
                packagingStatus: order.packagingStatusLabel,
                total: formatTnd(order.total),
                trackingNumber: order.delivery?.trackingNumber ?? null,
              },
            }
          : { found: false, message: "No accessible order was found with that number." },
        links: [{ label: "Open my orders", href: "/account/orders" }],
      };
    }

    case "get_non_shipped_orders": {
      if (!canUseOps(context.role)) {
        return { output: { error: "Unauthorized tool." } };
      }

      const limit = parseLimit(args.limit, 5, 10);
      const records = await getOrderRecords();
      const orders = records.data
        .filter((order) => !["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "RETURNED", "CANCELLED"].includes(order.deliveryStatus))
        .slice(0, limit);

      return {
        output: {
          count: orders.length,
          orders: orders.map((order) => ({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            total: formatTnd(order.total),
            placedAt: formatDate(order.placedAt),
            deliveryStatus: order.deliveryStatus,
          })),
        },
        links: [{ label: "Open orders", href: "/admin/orders" }],
      };
    }

    case "get_low_stock_products": {
      if (!canUseOps(context.role)) {
        return { output: { error: "Unauthorized tool." } };
      }

      const limit = parseLimit(args.limit, 6, 10);
      const products = await getProductRecords();
      const lowStock = products.data
        .filter((product) => product.stockOnHand <= product.lowStockThreshold)
        .sort((left, right) => left.stockOnHand - right.stockOnHand)
        .slice(0, limit);

      return {
        output: {
          count: lowStock.length,
          products: lowStock.map((product) => ({
            name: product.name,
            sku: product.sku,
            stockOnHand: product.stockOnHand,
            lowStockThreshold: product.lowStockThreshold,
            retailPrice: formatTnd(product.promotionalPrice ?? product.retailPrice),
          })),
        },
        links: [{ label: "Open stock", href: "/admin/inventory" }],
      };
    }

    case "get_pending_orders": {
      if (!canUseOps(context.role)) {
        return { output: { error: "Unauthorized tool." } };
      }

      const limit = parseLimit(args.limit, 5, 10);
      const records = await getOrderRecords();
      const pending = records.data
        .filter((order) => ["PENDING", "CONFIRMED", "PICKING", "READY_FOR_DELIVERY"].includes(order.status))
        .slice(0, limit);

      return {
        output: {
          count: pending.length,
          orders: pending.map((order) => ({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            status: order.status,
            total: formatTnd(order.total),
            isNew: order.isNew,
          })),
        },
        links: [{ label: "Open orders", href: "/admin/orders" }],
      };
    }

    case "get_recent_orders": {
      if (!canUseOps(context.role)) {
        return { output: { error: "Unauthorized tool." } };
      }

      const limit = parseLimit(args.limit, 6, 12);
      const status = String(args.status ?? "").trim().toUpperCase();
      const records = await getOrderRecords();
      const orders = records.data
        .filter((order) => (status ? order.status === status : true))
        .slice(0, limit);

      return {
        output: {
          count: orders.length,
          status: status || null,
          orders: orders.map((order) => ({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            status: order.status,
            paymentStatus: order.paymentStatus,
            deliveryStatus: order.deliveryStatus,
            total: formatTnd(order.total),
            placedAt: formatDate(order.placedAt),
            itemsPreview: order.itemsPreview,
            isNew: order.isNew,
          })),
        },
        links: [{ label: "Open orders", href: "/admin/orders" }],
      };
    }

    case "get_sales_summary": {
      if (!canUseOps(context.role)) {
        return { output: { error: "Unauthorized tool." } };
      }

      const days = parseLimit(args.days, 7, 365);
      const records = await getOrderRecords();
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const recent = records.data.filter((order) => new Date(order.placedAt).getTime() >= cutoff);
      const total = recent.reduce((sum, order) => sum + order.total, 0);
      const average = recent.length ? total / recent.length : 0;

      return {
        output: {
          days,
          ordersCount: recent.length,
          revenue: formatTnd(total),
          averageOrderValue: formatTnd(average),
          recentOrders: recent.slice(0, 5).map((order) => ({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            total: formatTnd(order.total),
            placedAt: formatDate(order.placedAt),
          })),
        },
        links: [{ label: "Open dashboard", href: "/admin" }],
      };
    }

    default:
      return { output: { error: `Unknown tool: ${name}` } };
  }
}
