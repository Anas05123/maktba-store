import "server-only";

import { formatDate, formatTnd } from "@/lib/format";
import { getOrderRecords, getProductRecords } from "@/lib/admin/cms";
import { getStorefrontApiData } from "@/lib/storefront";

type AssistantRole = "GUEST" | "CUSTOMER" | "ADMIN" | "MANAGER" | "STAFF";

export type AssistantDemoReply = {
  message: string;
  suggestions: string[];
  links: Array<{
    label: string;
    href: string;
  }>;
};

export type AssistantDemoHistoryItem = {
  role: "assistant" | "user";
  content: string;
};

type AssistantContext = {
  role: AssistantRole;
  name?: string | null;
  history?: AssistantDemoHistoryItem[];
};

const publicSuggestions = [
  "Show me the products",
  "I need a back-to-school pack",
  "Do you deliver in Tunisia?",
  "How does cash on delivery work?",
];

const adminSuggestions = [
  "Show me non-shipped orders",
  "Which products are low stock?",
  "How many pending orders do I have?",
  "Summary of the last 7 days",
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function tokenize(value: string) {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "show",
    "need",
    "want",
    "give",
    "have",
    "that",
    "this",
    "these",
    "those",
    "them",
    "just",
    "more",
    "best",
    "hello",
    "bonjour",
    "salut",
    "please",
    "products",
    "product",
    "produits",
    "produit",
    "catalog",
    "catalogue",
    "shop",
    "store",
    "boutique",
    "search",
    "find",
    "need",
    "want",
    "cherche",
    "montre",
    "donne",
    "voir",
    "avec",
    "sans",
    "pour",
    "dans",
    "mon",
    "mes",
    "vos",
    "leur",
    "des",
    "les",
    "une",
    "tout",
    "tous",
    "quels",
    "quelles",
    "which",
    "what",
    "moi",
  ]);

  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function buildSuggestions(role: AssistantRole) {
  return role === "ADMIN" ? adminSuggestions : publicSuggestions;
}

function buildGreeting(role: AssistantRole, name?: string | null): AssistantDemoReply {
  const firstName = name?.trim()?.split(" ")[0];

  if (role === "ADMIN") {
    return {
      message: firstName
        ? `Hello ${firstName}, I am the Maktba admin AI assistant. You can ask me things like "show me non-shipped orders", "which products are low stock", or "summary of the last 7 days".`
        : 'Hello, I am the Maktba admin AI assistant. You can ask me things like "show me non-shipped orders", "which products are low stock", or "summary of the last 7 days".',
      suggestions: adminSuggestions,
      links: [
        { label: "Open orders", href: "/admin/orders" },
        { label: "Open stock", href: "/admin/inventory" },
      ],
    };
  }

  return {
    message: firstName
      ? `Hello ${firstName}, I am the Maktba shopping AI assistant. I can help you find school packs, notebooks, pens, bags, and explain delivery in Tunisia and cash on delivery.`
      : "Hello, I am the Maktba shopping AI assistant. I can help you find school packs, notebooks, pens, bags, and explain delivery in Tunisia and cash on delivery.",
    suggestions: publicSuggestions,
    links: [
      { label: "Browse catalog", href: "/catalog" },
      { label: "Back-to-school packs", href: "/categories/packs-grossiste" },
    ],
  };
}

function buildCombinedSearchText(message: string, history: AssistantDemoHistoryItem[] = []) {
  const normalized = normalizeText(message);
  const previousUserMessages = history
    .filter((item) => item.role === "user")
    .slice(-3)
    .map((item) => normalizeText(item.content))
    .filter(Boolean);

  const genericFollowUp = includesAny(normalized, [
    "show me",
    "show products",
    "more",
    "others",
    "what about",
    "and for",
    "what else",
    "those",
    "them",
  ]);

  return genericFollowUp ? `${previousUserMessages.join(" ")} ${normalized}`.trim() : normalized;
}

function buildProductReply(
  products: Awaited<ReturnType<typeof getStorefrontApiData>>["products"],
  role: AssistantRole,
  intro?: string,
): AssistantDemoReply {
  const selected = products.slice(0, 5);

  return {
    message: `${intro ?? "Here are some products that match your request."}\n\n${selected
      .map(
        (product) =>
          `- ${product.name} | ${product.categoryName} | ${formatTnd(product.retailPrice)}${product.stockOnHand > 0 ? " | in stock" : " | out of stock"}`,
      )
      .join("\n")}`,
    suggestions: buildSuggestions(role),
    links: selected.map((product) => ({
      label: product.name,
      href: `/products/${product.slug}`,
    })),
  };
}

function buildCategoryReply(
  categories: Awaited<ReturnType<typeof getStorefrontApiData>>["categories"],
  role: AssistantRole,
): AssistantDemoReply {
  const selected = categories.slice(0, 4);

  return {
    message: `These categories should help you browse faster.\n\n${selected
      .map((category) => `- ${category.name} | ${category.description}`)
      .join("\n")}`,
    suggestions: buildSuggestions(role),
    links: selected.map((category) => ({
      label: category.name,
      href: `/categories/${category.slug}`,
    })),
  };
}

export async function answerAssistantDemo(
  rawMessage: string,
  context: AssistantContext,
): Promise<AssistantDemoReply> {
  const normalizedMessage = normalizeText(rawMessage);

  if (!normalizedMessage) {
    return buildGreeting(context.role, context.name);
  }

  const history = context.history ?? [];
  const combinedSearchText = buildCombinedSearchText(rawMessage, history);
  const normalizedCombinedSearch = normalizeText(combinedSearchText);

  if (
    includesAny(normalizedMessage, [
      "hi",
      "hello",
      "bonjour",
      "salut",
      "hey",
    ])
  ) {
    return buildGreeting(context.role, context.name);
  }

  if (
    includesAny(normalizedMessage, [
      "paiement",
      "cash on delivery",
      "payment on delivery",
      "payment",
      "cod",
      "payer a la livraison",
      "paiement a la livraison",
      "livraison",
      "delivery",
      "tunisia delivery",
    ])
  ) {
    return {
      message:
        "Maktba Store is Tunisia-focused. Prices are shown in TND, payment on delivery is available, and delivery can be arranged across Tunisia. The checkout is meant to stay simple and reassuring for parents and families.",
      suggestions: buildSuggestions(context.role),
      links: [
        { label: "Open checkout", href: "/checkout" },
        { label: "Open cart", href: "/cart" },
      ],
    };
  }

  if (context.role === "ADMIN") {
    if (
      includesAny(normalizedMessage, [
        "non shipped",
        "not shipped",
        "non expediees",
        "commandes non expediees",
        "orders not shipped",
      ])
    ) {
      const records = await getOrderRecords();
      const pendingShipment = records.data.filter(
        (order) =>
          !["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "RETURNED", "CANCELLED"].includes(
            order.deliveryStatus,
          ),
      );

      return {
        message: pendingShipment.length
          ? `I found ${pendingShipment.length} order(s) still not shipped.\n\n${pendingShipment
              .slice(0, 5)
              .map(
                (order) =>
                  `- ${order.orderNumber} | ${order.customerName} | ${formatTnd(order.total)} | ${formatDate(order.placedAt)}`,
              )
              .join("\n")}`
          : "I did not find any non-shipped orders right now.",
        suggestions: adminSuggestions,
        links: [{ label: "Open orders", href: "/admin/orders" }],
      };
    }

    if (
      includesAny(normalizedMessage, [
        "low stock",
        "stock faible",
        "alerte stock",
        "rupture",
        "produits en alerte",
      ])
    ) {
      const products = await getProductRecords();
      const lowStock = products.data
        .filter((product) => product.stockOnHand <= product.lowStockThreshold)
        .sort((left, right) => left.stockOnHand - right.stockOnHand);

      return {
        message: lowStock.length
          ? `These products need stock attention.\n\n${lowStock
              .slice(0, 6)
              .map(
                (product) =>
                  `- ${product.name} | stock ${product.stockOnHand} | alert ${product.lowStockThreshold}`,
              )
              .join("\n")}`
          : "Good news: no products are currently below the stock alert threshold.",
        suggestions: adminSuggestions,
        links: [{ label: "Open stock", href: "/admin/inventory" }],
      };
    }

    if (
      includesAny(normalizedMessage, [
        "pending orders",
        "commandes en attente",
        "how many pending orders",
        "en attente",
      ])
    ) {
      const records = await getOrderRecords();
      const pendingOrders = records.data.filter((order) =>
        ["PENDING", "CONFIRMED", "PICKING", "READY_FOR_DELIVERY"].includes(order.status),
      );

      return {
        message: pendingOrders.length
          ? `You currently have ${pendingOrders.length} active order(s) to process.\n\n${pendingOrders
              .slice(0, 5)
              .map(
                (order) =>
                  `- ${order.orderNumber} | ${order.customerName} | ${order.status} | ${formatTnd(order.total)}`,
              )
              .join("\n")}`
          : "There are no pending orders at the moment.",
        suggestions: adminSuggestions,
        links: [{ label: "Open orders", href: "/admin/orders" }],
      };
    }

    if (
      includesAny(normalizedMessage, [
        "7 derniers jours",
        "last 7 days",
        "last week",
        "semaine",
      ])
    ) {
      const records = await getOrderRecords();
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recentOrders = records.data.filter(
        (order) => new Date(order.placedAt).getTime() >= weekAgo,
      );
      const revenue = recentOrders.reduce((sum, order) => sum + order.total, 0);

      return {
        message: `Over the last 7 days, you received ${recentOrders.length} order(s) for a total of ${formatTnd(revenue)}.`,
        suggestions: adminSuggestions,
        links: [{ label: "Open dashboard", href: "/admin" }],
      };
    }
  }

  const catalog = await getStorefrontApiData();

  if (
    includesAny(normalizedMessage, [
      "show me the products",
      "show products",
      "browse products",
      "see products",
      "show me products",
      "montre moi les produits",
      "voir les produits",
      "catalogue",
      "catalog",
    ])
  ) {
    const featured = catalog.featuredProducts.length
      ? catalog.featuredProducts
      : catalog.products.slice(0, 6);

    return buildProductReply(
      featured,
      context.role,
      "Here are some good products to start browsing in the store.",
    );
  }

  if (
    includesAny(normalizedCombinedSearch, [
      "pack",
      "rentree",
      "back to school",
      "school pack",
      "primaire",
      "college",
    ])
  ) {
    const packs = catalog.products.filter((product) =>
      includesAny(
        normalizeText(
          `${product.name} ${product.shortDescription} ${product.description} ${product.categoryName}`,
        ),
        ["pack", "rentree", "primaire", "college"],
      ),
    );

    if (packs.length) {
      return buildProductReply(
        packs,
        context.role,
        "These packs and back-to-school selections should be useful.",
      );
    }
  }

  const searchTerms = tokenize(normalizedCombinedSearch);

  const scoredProducts = catalog.products
    .map((product) => {
      const haystack = normalizeText(
        `${product.name} ${product.shortDescription} ${product.description} ${product.categoryName} ${product.tags.join(" ")} ${product.brandName ?? ""}`,
      );

      const score = searchTerms.reduce((sum, term) => {
        if (haystack.includes(term)) {
          return sum + (product.name.toLowerCase().includes(term) ? 4 : 2);
        }
        return sum;
      }, 0);

      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.product);

  const scoredCategories = catalog.categories
    .map((category) => {
      const haystack = normalizeText(
        `${category.name} ${category.description} ${category.slug}`,
      );
      const score = searchTerms.reduce((sum, term) => {
        if (haystack.includes(term)) {
          return sum + (category.name.toLowerCase().includes(term) ? 3 : 1);
        }
        return sum;
      }, 0);

      return { category, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.category);

  if (scoredProducts.length > 0) {
    return buildProductReply(scoredProducts, context.role);
  }

  if (scoredCategories.length > 0) {
    return buildCategoryReply(scoredCategories, context.role);
  }

  if (
    includesAny(normalizedCombinedSearch, [
      "bag",
      "cartable",
      "sac",
      "trousse",
      "pen",
      "stylo",
      "notebook",
      "cahier",
      "paper",
      "papier",
      "creative",
      "color",
      "crayon",
      "feutre",
    ])
  ) {
    return {
      message:
        "I understand the type of product you want, but I need one more detail to guide you better. For example, you can tell me: cartables, trousses, stylos, cahiers, papier, crayons de couleur, or packs rentree.",
      suggestions: buildSuggestions(context.role),
      links: [
        { label: "School supplies", href: "/categories/fournitures-scolaires" },
        { label: "Cartables & trousses", href: "/categories/bagagerie" },
        { label: "Creative supplies", href: "/categories/arts-creatifs" },
      ],
    };
  }

  return {
    message:
      "I can help with product discovery, delivery/payment questions, and if you are admin, with orders and stock. Try asking something more specific like: 'show me the products', 'I need a back-to-school pack', 'Do you deliver in Tunisia?', or 'show me non-shipped orders'.",
    suggestions: buildSuggestions(context.role),
    links:
      context.role === "ADMIN"
        ? [
            { label: "Open orders", href: "/admin/orders" },
            { label: "Browse catalog", href: "/catalog" },
          ]
        : [
            { label: "Browse catalog", href: "/catalog" },
            { label: "School packs", href: "/categories/packs-grossiste" },
          ],
  };
}
