import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { categorySchema } from "@/lib/admin/validators";
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
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        image: parsed.data.image || null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/");

    return NextResponse.json({ message: "Category updated" });
  } catch {
    return dbUnavailableResponse();
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  if (!isLiveMode()) return dbUnavailableResponse();

  const { id } = await params;
  try {
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/");

    return NextResponse.json({ message: "Category deleted" });
  } catch {
    return dbUnavailableResponse();
  }
}
