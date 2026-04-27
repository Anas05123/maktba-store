import { OrderManager } from "@/components/admin/cms/order-manager";
import {
  getUnreadOrderNotificationSummary,
  markOrderNotificationsRead,
} from "@/lib/admin/order-notifications";
import { getOrderRecords } from "@/lib/admin/cms";
import { hasDatabaseUrl } from "@/lib/env";

export default async function AdminOrdersPage() {
  const unreadSummary = hasDatabaseUrl
    ? await getUnreadOrderNotificationSummary()
    : { count: 0, orderIds: [] };

  if (unreadSummary.orderIds.length) {
    await markOrderNotificationsRead(unreadSummary.orderIds);
  }

  const records = await getOrderRecords();

  return (
    <OrderManager
      initialOrders={records.data}
      initialLiveMode={records.live}
      highlightedOrderIds={unreadSummary.orderIds}
    />
  );
}
