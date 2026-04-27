import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { getProductRecords, requireAdminApi, dbUnavailableResponse, isLiveMode } from "@/lib/admin/cms";
import { productSchema } from "@/lib/admin/validators";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const records = await getProductRecords();
  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  if (!isLiveMode()) return dbUnavailableResponse();

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        barcode: data.barcode || null,
        shortDescription: data.shortDescription,
        description: data.description,
        ...(data.specifications && Object.keys(data.specifications).length > 0
          ? { specifications: data.specifications as Prisma.InputJsonValue }
          : {}),
        tags: data.tags,
        categoryId: data.categoryId,
        unit: data.unit,
        packSize: data.packSize,
        minimumOrderQuantity: data.minimumOrderQuantity,
        stockOnHand: data.stockOnHand,
        retailPrice: data.retailPrice,
        wholesalePrice: data.wholesalePrice,
        promotionalPrice: data.promotionalPrice ?? null,
        compareAtPrice:
          data.promotionalPrice && data.promotionalPrice < data.retailPrice
            ? data.retailPrice
            : null,
        costPrice: data.costPrice,
        lowStockThreshold: data.lowStockThreshold,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        images: {
          create: data.imageUrls.map((url, index) => ({
            url,
            altText: data.name,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/");

    return NextResponse.json({ id: product.id, message: "Product created" });
  } catch {
    return dbUnavailableResponse();
  }
}
