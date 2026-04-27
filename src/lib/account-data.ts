import type {
  DeliveryStatus,
  FulfillmentStatus,
  OrderStatus,
  PackagingStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";

type SessionUser = {
  id: string;
  role: string;
  customerId?: string | null;
  email?: string | null;
};

export type AccountOrderListItem = {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  statusLabel: string;
  paymentStatus: PaymentStatus;
  paymentStatusLabel: string;
  fulfillmentStatus: FulfillmentStatus;
  fulfillmentStatusLabel: string;
  packagingStatus: PackagingStatus;
  packagingStatusLabel: string;
  deliveryStatus: DeliveryStatus;
  deliveryStatusLabel: string;
  paymentMethod: PaymentMethod;
  paymentMethodLabel: string;
  subtotal: number;
  shippingFee: number;
  taxTotal: number;
  total: number;
  itemsCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddressLine: string;
  receiverCity: string;
  receiverGovernorate: string;
  customerNotes: string;
  internalNotes: string;
  items: Array<{
    id: string;
    productId: string;
    name: string;
    slug: string | null;
    imageUrl: string | null;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  invoice: {
    invoiceNumber: string;
    issueDate: string;
    status: string;
  } | null;
  delivery: {
    courierName: string;
    courierCompany: string;
    trackingNumber: string;
    status: DeliveryStatus;
    statusLabel: string;
    estimatedDeliveryDate: string | null;
    dispatchDate: string | null;
    completedAt: string | null;
    notes: string;
    events: Array<{
      id: string;
      label: string;
      description: string;
      location: string;
      eventAt: string;
    }>;
  } | null;
  timeline: Array<{
    id: string;
    label: string;
    detail: string;
    at: string;
  }>;
};

export type AccountOverview = {
  sessionUser: SessionUser;
  displayName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  customerCode: string | null;
  city: string;
  governorate: string;
  orderCount: number;
  totalSpent: number;
  latestOrderDate: string | null;
  addresses: Array<{
    id: string;
    label: string;
    line1: string;
    city: string;
    governorate: string;
    isDefault: boolean;
  }>;
  recentOrders: AccountOrderListItem[];
};

export type InvoiceDocumentOrder = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  receiverName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingGovernorate: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  delivery: {
    courier: string;
    trackingNumber: string;
  };
  invoice: {
    invoiceNumber: string;
    issueDate: string;
  };
};

type AccountOrderEntity = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    items: true;
    invoice: true;
    delivery: {
      include: {
        events: true;
      };
    };
    fulfillmentHistory: true;
    packagingHistory: true;
  };
}>;

function getOrderStatusLabel(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "CONFIRMED":
      return "Confirmee";
    case "PICKING":
      return "Preparation";
    case "READY_FOR_DELIVERY":
      return "Prete pour livraison";
    case "SHIPPED":
      return "Expediee";
    case "DELIVERED":
      return "Livree";
    case "CANCELLED":
      return "Annulee";
    case "RETURNED":
      return "Retournee";
    default:
      return status;
  }
}

function getPaymentStatusLabel(status: PaymentStatus) {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "PARTIALLY_PAID":
      return "Partiellement paye";
    case "PAID":
      return "Paye";
    case "FAILED":
      return "Echec";
    case "REFUNDED":
      return "Rembourse";
    default:
      return status;
  }
}

function getFulfillmentStatusLabel(status: FulfillmentStatus) {
  switch (status) {
    case "UNALLOCATED":
      return "Non allouee";
    case "CONFIRMED":
      return "Confirmee";
    case "PREPARING":
      return "Preparation";
    case "PICKING":
      return "Picking";
    case "READY_FOR_PACKAGING":
      return "Prete pour emballage";
    case "READY_FOR_DISPATCH":
      return "Prete pour expedition";
    case "FULFILLED":
      return "Terminee";
    case "CANCELLED":
      return "Annulee";
    case "RETURNED":
      return "Retournee";
    default:
      return status;
  }
}

function getPackagingStatusLabel(status: PackagingStatus) {
  switch (status) {
    case "NOT_REQUIRED":
      return "Non requis";
    case "NOT_STARTED":
      return "Non commence";
    case "IN_PROGRESS":
      return "En cours";
    case "PACKAGED":
      return "Emballe";
    case "LABELLED":
      return "Etiquete";
    case "HANDED_TO_COURIER":
      return "Remis au livreur";
    default:
      return status;
  }
}

function getDeliveryStatusLabel(status: DeliveryStatus) {
  switch (status) {
    case "NOT_ASSIGNED":
      return "Non assignee";
    case "ASSIGNED":
      return "Assignee";
    case "SHIPPED":
      return "Expediee";
    case "OUT_FOR_DELIVERY":
      return "En cours de livraison";
    case "DELIVERED":
      return "Livree";
    case "FAILED":
      return "Echec livraison";
    case "RETURNED":
      return "Retournee";
    case "CANCELLED":
      return "Annulee";
    default:
      return status;
  }
}

function getPaymentMethodLabel(method: PaymentMethod) {
  switch (method) {
    case "CASH_ON_DELIVERY":
      return "Paiement a la livraison";
    case "BANK_TRANSFER":
      return "Virement bancaire";
    case "CARD":
      return "Carte bancaire";
    case "CHEQUE":
      return "Cheque";
    case "WALLET":
      return "Portefeuille";
    default:
      return method;
  }
}

async function requireSessionUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/account");
  }

  return session.user as SessionUser;
}

async function resolveAccountIdentity() {
  const sessionUser = await requireSessionUser();

  if (!hasDatabaseUrl) {
    return {
      sessionUser,
      user: null,
      customer: null,
      customerId: sessionUser.customerId ?? null,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: {
        customer: {
          include: {
            addresses: {
              where: { deletedAt: null },
              orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
            },
          },
        },
        customerProfile: true,
      },
    });

    let customer = user?.customer ?? null;

    if (!customer && sessionUser.email) {
      customer = await prisma.customer.findFirst({
        where: {
          email: sessionUser.email.trim().toLowerCase(),
          deletedAt: null,
        },
        include: {
          addresses: {
            where: { deletedAt: null },
            orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
          },
        },
      });
    }

    return {
      sessionUser,
      user,
      customer,
      customerId: customer?.id ?? user?.customerId ?? sessionUser.customerId ?? null,
    };
  } catch {
    return {
      sessionUser,
      user: null,
      customer: null,
      customerId: sessionUser.customerId ?? null,
    };
  }
}

async function resolveOrderCustomerId(identity: Awaited<ReturnType<typeof resolveAccountIdentity>>) {
  if (!hasDatabaseUrl) {
    return identity.customerId;
  }

  try {
    if (identity.customerId) {
      const directOrderCount = await prisma.order.count({
        where: {
          customerId: identity.customerId,
          deletedAt: null,
        },
      });

      if (directOrderCount > 0 || !identity.sessionUser.email) {
        return identity.customerId;
      }
    }

    if (!identity.sessionUser.email) {
      return identity.customerId;
    }

    const fallbackCustomer = await prisma.customer.findFirst({
      where: {
        email: identity.sessionUser.email.trim().toLowerCase(),
        deletedAt: null,
        orders: {
          some: {
            deletedAt: null,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!fallbackCustomer) {
      return identity.customerId;
    }

    if (identity.user && identity.user.customerId !== fallbackCustomer.id) {
      await prisma.user.update({
        where: { id: identity.user.id },
        data: {
          customerId: fallbackCustomer.id,
        },
      });
    }

    return fallbackCustomer.id;
  } catch {
    return identity.customerId;
  }
}

async function resolveAccessibleCustomerIds(
  identity: Awaited<ReturnType<typeof resolveAccountIdentity>>,
) {
  const ids = new Set<string>();

  const resolvedCustomerId = await resolveOrderCustomerId(identity);
  if (resolvedCustomerId) {
    ids.add(resolvedCustomerId);
  }

  if (!hasDatabaseUrl || !identity.sessionUser.email) {
    return Array.from(ids);
  }

  try {
    const matchingCustomers = await prisma.customer.findMany({
      where: {
        email: identity.sessionUser.email.trim().toLowerCase(),
        deletedAt: null,
      },
      select: {
        id: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    for (const customer of matchingCustomers) {
      ids.add(customer.id);
    }
  } catch {
    return Array.from(ids);
  }

  return Array.from(ids);
}

function buildTimeline(order: AccountOrderEntity) {
  const entries: Array<{ id: string; label: string; detail: string; at: string }> = [
    {
      id: `placed-${order.id}`,
      label: "Commande recue",
      detail: `Commande ${order.orderNumber} enregistree sur le site.`,
      at: order.placedAt.toISOString(),
    },
  ];

  for (const history of order.fulfillmentHistory) {
    entries.push({
      id: history.id,
      label: `Preparation: ${getFulfillmentStatusLabel(history.status)}`,
      detail: history.note ?? "Mise a jour logistique.",
      at: history.changedAt.toISOString(),
    });
  }

  for (const history of order.packagingHistory) {
    entries.push({
      id: history.id,
      label: `Packaging: ${getPackagingStatusLabel(history.status)}`,
      detail: history.note ?? "Mise a jour emballage.",
      at: history.changedAt.toISOString(),
    });
  }

  for (const event of order.delivery?.events ?? []) {
    entries.push({
      id: event.id,
      label: `Livraison: ${getDeliveryStatusLabel(event.status)}`,
      detail: event.description ?? "Suivi transport mis a jour.",
      at: event.eventAt.toISOString(),
    });
  }

  return entries.sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime());
}

function mapOrder(
  order: AccountOrderEntity,
): AccountOrderListItem {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    placedAt: order.placedAt.toISOString(),
    status: order.status,
    statusLabel: getOrderStatusLabel(order.status),
    paymentStatus: order.paymentStatus,
    paymentStatusLabel: getPaymentStatusLabel(order.paymentStatus),
    fulfillmentStatus: order.fulfillmentStatus,
    fulfillmentStatusLabel: getFulfillmentStatusLabel(order.fulfillmentStatus),
    packagingStatus: order.packagingStatus,
    packagingStatusLabel: getPackagingStatusLabel(order.packagingStatus),
    deliveryStatus: order.deliveryStatus,
    deliveryStatusLabel: getDeliveryStatusLabel(order.deliveryStatus),
    paymentMethod: order.paymentMethod,
    paymentMethodLabel: getPaymentMethodLabel(order.paymentMethod),
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    taxTotal: Number(order.taxTotal),
    total: Number(order.total),
    itemsCount: order.itemsCount,
    customerName: order.customer?.contactName ?? order.receiverName,
    customerEmail: order.customer?.email ?? order.receiverEmail ?? "",
    customerPhone: order.customer?.phone ?? order.receiverPhone,
    receiverName: order.receiverName,
    receiverPhone: order.receiverPhone,
    receiverAddressLine: order.receiverAddressLine,
    receiverCity: order.receiverCity,
    receiverGovernorate: order.receiverGovernorate,
    customerNotes: order.customerNotes ?? "",
    internalNotes: order.internalNotes ?? "",
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.productName,
      slug: item.productSlug ?? null,
      imageUrl: item.productImageUrl ?? null,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
    })),
    invoice: order.invoice
      ? {
          invoiceNumber: order.invoice.invoiceNumber,
          issueDate: order.invoice.issueDate.toISOString(),
          status: order.invoice.status,
        }
      : null,
    delivery: order.delivery
      ? {
          courierName: order.delivery.courierName ?? "",
          courierCompany: order.delivery.courierCompany ?? "",
          trackingNumber: order.delivery.trackingNumber ?? "",
          status: order.delivery.status,
          statusLabel: getDeliveryStatusLabel(order.delivery.status),
          estimatedDeliveryDate: order.delivery.estimatedDeliveryDate?.toISOString() ?? null,
          dispatchDate: order.delivery.dispatchDate?.toISOString() ?? null,
          completedAt: order.delivery.completedAt?.toISOString() ?? null,
          notes: order.delivery.notes ?? "",
          events: order.delivery.events.map((event) => ({
            id: event.id,
            label: getDeliveryStatusLabel(event.status),
            description: event.description ?? "",
            location: event.location ?? "",
            eventAt: event.eventAt.toISOString(),
          })),
        }
      : null,
    timeline: buildTimeline(order),
  };
}

async function fetchOrdersForCustomerIds(customerIds: string[]) {
  if (!customerIds.length) {
    return [];
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        customerId: {
          in: customerIds,
        },
        deletedAt: null,
      },
      include: {
        customer: true,
        items: {
          orderBy: { productName: "asc" },
        },
        invoice: true,
        delivery: {
          include: {
            events: {
              orderBy: { eventAt: "asc" },
            },
          },
        },
        fulfillmentHistory: {
          orderBy: { changedAt: "asc" },
        },
        packagingHistory: {
          orderBy: { changedAt: "asc" },
        },
      },
      orderBy: { placedAt: "desc" },
    });

    return orders.map(mapOrder);
  } catch {
    return [];
  }
}

export async function getAccountOverview() {
  const identity = await resolveAccountIdentity();
  const accessibleCustomerIds = await resolveAccessibleCustomerIds(identity);
  const resolvedCustomerId = accessibleCustomerIds[0] ?? null;

  if (!resolvedCustomerId) {
    return {
      sessionUser: identity.sessionUser,
      displayName: identity.user?.name ?? identity.sessionUser.email ?? "Client",
      email: identity.user?.email ?? identity.sessionUser.email ?? "",
      phone: identity.user?.phone ?? "",
      preferredLanguage: identity.user?.customerProfile?.preferredLanguage ?? "fr",
      customerCode: null,
      city: "",
      governorate: "",
      orderCount: 0,
      totalSpent: 0,
      latestOrderDate: null,
      addresses: [],
      recentOrders: [],
    } satisfies AccountOverview;
  }

  const orders = await fetchOrdersForCustomerIds(accessibleCustomerIds);

  return {
    sessionUser: identity.sessionUser,
    displayName:
      identity.user?.customerProfile?.firstName && identity.user?.customerProfile?.lastName
        ? `${identity.user.customerProfile.firstName} ${identity.user.customerProfile.lastName}`.trim()
        : identity.customer?.contactName ??
          identity.user?.name ??
          identity.sessionUser.email ??
          "Client",
    email:
      identity.user?.email ??
      identity.customer?.email ??
      identity.sessionUser.email ??
      "",
    phone: identity.user?.phone ?? identity.customer?.phone ?? "",
    preferredLanguage: identity.user?.customerProfile?.preferredLanguage ?? "fr",
    customerCode: identity.customer?.code ?? null,
    city: identity.customer?.city ?? "",
    governorate: identity.customer?.governorate ?? "",
    orderCount: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    latestOrderDate: orders[0]?.placedAt ?? null,
    addresses:
      identity.customer?.addresses.map((address) => ({
        id: address.id,
        label: address.label,
        line1: address.line1,
        city: address.city,
        governorate: address.governorate,
        isDefault: address.isDefault,
      })) ?? [],
    recentOrders: orders.slice(0, 4),
  } satisfies AccountOverview;
}

export async function getCurrentUserOrders() {
  const identity = await resolveAccountIdentity();
  const accessibleCustomerIds = await resolveAccessibleCustomerIds(identity);

  if (!accessibleCustomerIds.length) {
    return [];
  }

  return fetchOrdersForCustomerIds(accessibleCustomerIds);
}

export async function getAccessibleOrderByNumber(orderNumber: string) {
  const identity = await resolveAccountIdentity();
  const accessibleCustomerIds = await resolveAccessibleCustomerIds(identity);

  if (!hasDatabaseUrl) {
    return null;
  }

  const where =
    identity.sessionUser.role === "ADMIN"
      ? { orderNumber, deletedAt: null as null }
      : accessibleCustomerIds.length
        ? {
            orderNumber,
            deletedAt: null as null,
            customerId: {
              in: accessibleCustomerIds,
            },
          }
        : null;

  if (!where) {
    return null;
  }

  try {
    const order = await prisma.order.findFirst({
      where,
      include: {
        customer: true,
        items: {
          orderBy: { productName: "asc" },
        },
        invoice: true,
        delivery: {
          include: {
            events: {
              orderBy: { eventAt: "asc" },
            },
          },
        },
        fulfillmentHistory: {
          orderBy: { changedAt: "asc" },
        },
        packagingHistory: {
          orderBy: { changedAt: "asc" },
        },
      },
    });

    return order ? mapOrder(order) : null;
  } catch {
    return null;
  }
}

export function mapOrderToInvoiceDocument(
  order: AccountOrderListItem,
) {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    receiverName: order.receiverName,
    shippingAddress: order.receiverAddressLine,
    shippingCity: order.receiverCity,
    shippingGovernorate: order.receiverGovernorate,
    paymentMethod: order.paymentMethodLabel,
    paymentStatus: order.paymentStatusLabel,
    orderStatus: order.statusLabel,
    subtotal: order.subtotal,
    shippingCost: order.shippingFee,
    taxAmount: order.taxTotal,
    total: order.total,
    items: order.items.map((item) => ({
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
    delivery: {
      courier: order.delivery?.courierCompany || order.delivery?.courierName || "A affecter",
      trackingNumber: order.delivery?.trackingNumber || "En attente",
    },
    invoice: {
      invoiceNumber: order.invoice?.invoiceNumber ?? `FAC-${order.orderNumber}`,
      issueDate: order.invoice?.issueDate ?? order.placedAt,
    },
  } satisfies InvoiceDocumentOrder;
}
