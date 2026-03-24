import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { dbUnavailableResponse, isLiveMode, requireAdminApi } from "@/lib/admin/cms";
import { orderUpdateSchema } from "@/lib/admin/validators";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  if (!isLiveMode()) return dbUnavailableResponse();

  const { id } = await params;
  const body = await request.json();
  const parsed = orderUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data.status,
        receiverName: parsed.data.receiverName,
        receiverPhone: parsed.data.receiverPhone,
        receiverCity: parsed.data.receiverCity,
        receiverGovernorate: parsed.data.receiverGovernorate,
        receiverAddressLine: parsed.data.receiverAddressLine,
        customerNotes: parsed.data.customerNotes || null,
      },
    });

    revalidatePath("/admin/orders");
    return NextResponse.json({ message: "Order updated" });
  } catch {
    return dbUnavailableResponse();
  }
}
