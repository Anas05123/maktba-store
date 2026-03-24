import { NextResponse } from "next/server";

import { getOrderRecords, requireAdminApi } from "@/lib/admin/cms";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const records = await getOrderRecords();
  return NextResponse.json(records);
}
