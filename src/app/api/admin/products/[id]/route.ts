import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { dbUnavailableResponse, isLiveMode, requireAdminApi } from "@/lib/admin/cms";
import { productSchema } from "@/lib/admin/validators";
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
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          shortDescription: data.shortDescription,
          description: data.description,
          categoryId: data.categoryId,
          unit: data.unit,
          packSize: data.packSize,
          minimumOrderQuantity: data.minimumOrderQuantity,
          stockOnHand: data.stockOnHand,
          retailPrice: data.retailPrice,
          wholesalePrice: data.wholesalePrice,
          costPrice: data.costPrice,
          lowStockThreshold: data.lowStockThreshold,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
        },
      });

      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productImage.createMany({
        data: data.imageUrls.map((url, index) => ({
          productId: id,
          url,
          altText: data.name,
          sortOrder: index,
          isPrimary: index === 0,
        })),
      });
    });

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");

    return NextResponse.json({ message: "Product updated" });
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
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");

    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return dbUnavailableResponse();
  }
}
