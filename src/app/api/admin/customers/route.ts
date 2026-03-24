import { NextResponse } from "next/server";

import { getCustomerRecords, requireAdminApi } from "@/lib/admin/cms";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const records = await getCustomerRecords();
  return NextResponse.json(records);
}
