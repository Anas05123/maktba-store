import { customers, expenses, orders, topProducts } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";

type TimelineEntry = {
  label: string;
  detail: string;
  at: string;
};

export type OperationalOrder = {
  id: string;
  orderNumber: string;
  placedAt: string;
  customerCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingGovernorate: string;
  fulfillmentStatus: string;
  packagingStatus: string;
  deliveryStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  orderStatus: string;
  estimatedProfit: number;
  internalNotes: string[];
  customerNotes: string;
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  delivery: {
    method: string;
    courier: string;
    trackingNumber: string;
    estimatedDeliveryDate: string;
    dispatchDate: string;
    completionDate?: string;
    notes: string;
    attempts: Array<{
      status: string;
      note: string;
      at: string;
    }>;
  };
  invoice: {
    invoiceNumber: string;
    issueDate: string;
    status: string;
  };
  timeline: TimelineEntry[];
};

export type CustomerAccountOverview = {
  code: string;
  displayName: string;
  email: string;
  phone: string;
  city: string;
  governorate: string;
  orderCount: number;
  totalSpent: number;
  latestOrderDate?: string;
  addresses: Array<{
    label: string;
    line1: string;
    city: string;
    governorate: string;
  }>;
};

export type FinancialSnapshot = {
  periodLabel: string;
  from: string;
  to: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  deliveryCosts: number;
  expenses: number;
  estimatedProfit: number;
  topCategories: Array<{ category: string; revenue: number }>;
  topProducts: Array<{ name: string; revenue: number; quantitySold: number }>;
};

function mapOperationalStatuses(status: string) {
  switch (status) {
    case "PENDING":
      return {
        fulfillmentStatus: "Commande recue",
        packagingStatus: "En attente",
        deliveryStatus: "Non assignee",
      };
    case "CONFIRMED":
      return {
        fulfillmentStatus: "Confirmee",
        packagingStatus: "Pre-packaging",
        deliveryStatus: "Planification livraison",
      };
    case "PICKING":
      return {
        fulfillmentStatus: "Preparation en cours",
        packagingStatus: "Preparation produits",
        deliveryStatus: "Non assignee",
      };
    case "READY_FOR_DELIVERY":
      return {
        fulfillmentStatus: "Pret a expedier",
        packagingStatus: "Emballee",
        deliveryStatus: "Assignee au transport",
      };
    case "SHIPPED":
      return {
        fulfillmentStatus: "Expediee",
        packagingStatus: "Remise au livreur",
        deliveryStatus: "En transit",
      };
    case "DELIVERED":
      return {
        fulfillmentStatus: "Terminee",
        packagingStatus: "Livree",
        deliveryStatus: "Livree",
      };
    default:
      return {
        fulfillmentStatus: status,
        packagingStatus: "A verifier",
        deliveryStatus: status,
      };
  }
}

export const operationalOrders: OperationalOrder[] = orders.map((order, index) => {
  const statusMap = mapOperationalStatuses(order.status);
  const placedAt = new Date(order.placedAt).toISOString();
  const trackingNumber = `MK-${order.orderNumber.replaceAll("CMD-", "")}-${index + 2}`;
  const dispatchDate = new Date(order.placedAt);
  dispatchDate.setDate(dispatchDate.getDate() + 1);
  const estimatedDeliveryDate = new Date(order.placedAt);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);

  const timeline: TimelineEntry[] = [
    {
      label: "Commande recue",
      detail: `Commande ${order.orderNumber} enregistree sur le site.`,
      at: placedAt,
    },
    {
      label: "Validation interne",
      detail: "Paiement, stock et informations client verifies.",
      at: new Date(new Date(placedAt).getTime() + 1000 * 60 * 90).toISOString(),
    },
    {
      label: "Preparation logistique",
      detail: statusMap.fulfillmentStatus,
      at: new Date(new Date(placedAt).getTime() + 1000 * 60 * 180).toISOString(),
    },
  ];

  if (["READY_FOR_DELIVERY", "SHIPPED", "DELIVERED"].includes(order.status)) {
    timeline.push({
      label: "Expedition",
      detail: `Remise au transporteur avec suivi ${trackingNumber}.`,
      at: dispatchDate.toISOString(),
    });
  }

  if (order.status === "DELIVERED") {
    timeline.push({
      label: "Livraison completee",
      detail: "Colis remis au client avec succes.",
      at: estimatedDeliveryDate.toISOString(),
    });
  }

  return {
    id: order.orderNumber,
    orderNumber: order.orderNumber,
    placedAt,
    customerCode: order.customer.code,
    customerName: order.customer.companyName,
    customerEmail: order.customer.email ?? "client@maktba.tn",
    customerPhone: order.customer.phone,
    receiverName: order.receiverName,
    receiverPhone: order.receiverPhone,
    shippingAddress: order.receiverAddressLine,
    shippingCity: order.receiverCity,
    shippingGovernorate: order.receiverGovernorate,
    fulfillmentStatus: statusMap.fulfillmentStatus,
    packagingStatus: statusMap.packagingStatus,
    deliveryStatus: statusMap.deliveryStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shippingCost: order.shippingFee,
    taxAmount: 0,
    total: order.total,
    orderStatus: order.status,
    estimatedProfit: order.estimatedProfit,
    internalNotes: [
      "Verifier concordance stock avant emballage.",
      "Appel client automatique en cas d'echec livraison.",
    ],
    customerNotes: order.notes ?? "",
    items: order.lineItems.map((item) => ({
      sku: item.sku,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
    delivery: {
      method: "Livraison standard Tunisie",
      courier: index % 2 === 0 ? "Rapid Poste" : "Livraison interne",
      trackingNumber,
      estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),
      dispatchDate: dispatchDate.toISOString(),
      ...(order.status === "DELIVERED"
        ? { completionDate: estimatedDeliveryDate.toISOString() }
        : {}),
      notes: "Confirmer la presence du receveur avant remise.",
      attempts: [
        {
          status: order.status === "DELIVERED" ? "Livree" : "Planifiee",
          note:
            order.status === "DELIVERED"
              ? "Remise signee par le client."
              : "Tournee ajoutee au planning du livreur.",
          at:
            order.status === "DELIVERED"
              ? estimatedDeliveryDate.toISOString()
              : dispatchDate.toISOString(),
        },
      ],
    },
    invoice: {
      invoiceNumber: `FAC-${order.orderNumber.replace("CMD", "2026")}`,
      issueDate: placedAt,
      status: order.paymentStatus === "PAID" ? "Payee" : "Emise",
    },
    timeline,
  };
});

export const customerAccountOverviews: CustomerAccountOverview[] = customers.map((customer) => {
  const relatedOrders = operationalOrders.filter((order) => order.customerCode === customer.code);

  return {
    code: customer.code,
    displayName: customer.contactName,
    email: customer.email ?? "client@maktba.tn",
    phone: customer.phone,
    city: customer.city,
    governorate: customer.governorate,
    orderCount: relatedOrders.length,
    totalSpent: relatedOrders.reduce((sum, order) => sum + order.total, 0),
    ...(relatedOrders[0] ? { latestOrderDate: relatedOrders[0].placedAt } : {}),
    addresses: [
      {
        label: "Adresse principale",
        line1: relatedOrders[0]?.shippingAddress ?? "Adresse a definir",
        city: customer.city,
        governorate: customer.governorate,
      },
    ],
  };
});

export const invoiceRegistry = operationalOrders.map((order) => ({
  invoiceNumber: order.invoice.invoiceNumber,
  orderNumber: order.orderNumber,
  customerName: order.customerName,
  issueDate: order.invoice.issueDate,
  total: order.total,
  status: order.invoice.status,
}));

export const deliveryBoard = operationalOrders.map((order) => ({
  orderNumber: order.orderNumber,
  customerName: order.customerName,
  courier: order.delivery.courier,
  trackingNumber: order.delivery.trackingNumber,
  deliveryStatus: order.deliveryStatus,
  estimatedDeliveryDate: order.delivery.estimatedDeliveryDate,
  shippingCity: order.shippingCity,
}));

const totalRevenue = operationalOrders.reduce((sum, order) => sum + order.total, 0);
const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
const totalDeliveryCosts = operationalOrders.reduce((sum, order) => sum + order.shippingCost, 0);

export const reportingSnapshots: FinancialSnapshot[] = [
  {
    periodLabel: "Mars 2026",
    from: "2026-03-01",
    to: "2026-03-31",
    revenue: totalRevenue,
    orders: operationalOrders.length,
    avgOrderValue: totalRevenue / Math.max(operationalOrders.length, 1),
    deliveryCosts: totalDeliveryCosts,
    expenses: totalExpenses,
    estimatedProfit:
      operationalOrders.reduce((sum, order) => sum + order.estimatedProfit, 0) - totalExpenses,
    topCategories: [
      { category: "Papier & impression", revenue: 1870 },
      { category: "Fournitures scolaires", revenue: 1655 },
      { category: "Bagagerie", revenue: 1221 },
    ],
    topProducts: topProducts.map((product) => ({
      name: product.name,
      revenue: product.revenue,
      quantitySold: product.quantitySold,
    })),
  },
];

export function getOperationalOrder(orderNumber: string) {
  return operationalOrders.find((order) => order.orderNumber === orderNumber);
}

export function getInvoiceRecord(invoiceNumber: string) {
  return invoiceRegistry.find((invoice) => invoice.invoiceNumber === invoiceNumber);
}

export function getCustomerAccountByCode(code: string) {
  return customerAccountOverviews.find((customer) => customer.code === code);
}

export function formatOperationalTimeline(entries: TimelineEntry[]) {
  return entries.map((entry) => ({
    ...entry,
    displayDate: formatDate(entry.at),
  }));
}

export function getReportSlug(report: FinancialSnapshot) {
  return report.periodLabel
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getReportingSnapshotBySlug(slug: string) {
  return reportingSnapshots.find((report) => getReportSlug(report) === slug);
}
