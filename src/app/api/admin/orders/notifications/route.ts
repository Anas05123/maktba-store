import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin/cms";
import { hasDatabaseUrl } from "@/lib/env";
import { getUnreadOrderNotificationSummary } from "@/lib/admin/order-notifications";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!hasDatabaseUrl) {
    return NextResponse.json({ count: 0, orderIds: [], live: false });
  }

  try {
    const summary = await getUnreadOrderNotificationSummary();
    return NextResponse.json({ ...summary, live: true });
  } catch {
    return NextResponse.json({ count: 0, orderIds: [], live: false });
  }
}
