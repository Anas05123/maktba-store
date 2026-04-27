import { prisma } from "@/lib/prisma";

export async function createNewOrderNotification({
  customerId,
  orderId,
  orderNumber,
  receiverName,
  total,
}: {
  customerId?: string | null;
  orderId: string;
  orderNumber: string;
  receiverName: string;
  total: number;
}) {
  try {
    return await prisma.notification.create({
      data: {
        customerId: customerId ?? null,
        orderId,
        channel: "IN_APP",
        status: "PENDING",
        title: `Nouvelle commande ${orderNumber}`,
        body: `Commande recue pour ${receiverName} - ${total.toFixed(3)} TND`,
      },
    });
  } catch {
    return null;
  }
}

export async function getUnreadOrderNotificationSummary() {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        orderId: { not: null },
        readAt: null,
        status: { not: "READ" },
        channel: "IN_APP",
      },
      select: {
        id: true,
        orderId: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const orderIds = Array.from(
      new Set(notifications.map((notification) => notification.orderId).filter(Boolean)),
    ) as string[];

    return {
      count: orderIds.length,
      orderIds,
    };
  } catch {
    return {
      count: 0,
      orderIds: [],
    };
  }
}

export async function markOrderNotificationsRead(orderIds?: string[]) {
  const where = {
    orderId: orderIds?.length ? { in: orderIds } : { not: null },
    readAt: null,
    status: { not: "READ" as const },
    channel: "IN_APP" as const,
  };

  try {
    await prisma.notification.updateMany({
      where,
      data: {
        readAt: new Date(),
        status: "READ",
      },
    });
  } catch {
    // Ignore read-state updates when the database is unavailable.
  }
}
