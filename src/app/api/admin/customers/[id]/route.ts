import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { customerSchema } from "@/lib/admin/validators";
import { dbUnavailableResponse, isLiveMode, requireAdminApi } from "@/lib/admin/cms";
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
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await prisma.customer.update({
      where: { id },
      data: {
        companyName: parsed.data.companyName,
        contactName: parsed.data.contactName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        city: parsed.data.city,
        governorate: parsed.data.governorate,
        isActive: parsed.data.isActive,
      },
    });

    revalidatePath("/admin/customers");
    return NextResponse.json({ message: "Customer updated" });
  } catch {
    return dbUnavailableResponse();
  }
}
