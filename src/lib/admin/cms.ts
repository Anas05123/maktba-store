import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  categories as demoCategories,
  customers as demoCustomers,
  products as demoProducts,
} from "@/lib/demo-data";

export async function requireAdminApi() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export function dbUnavailableResponse() {
  return NextResponse.json(
    {
      message:
        "Database connection is unavailable. Live CMS actions are temporarily disabled.",
    },
    { status: 503 },
  );
}

export function isLiveMode() {
  return hasDatabaseUrl;
}

export async function getCategoryRecords() {
  if (!isLiveMode()) {
    return {
      live: false,
      data: demoCategories.map((category) => ({
        id: category.slug,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        productCount: demoProducts.filter((product) => product.categorySlug === category.slug)
          .length,
      })),
    };
  }
  try {
    const data = await prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return {
      live: true,
      data: data.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        image: category.image ?? "",
        productCount: category._count.products,
      })),
    };
  } catch {
    return {
      live: false,
      data: demoCategories.map((category) => ({
        id: category.slug,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        productCount: demoProducts.filter((product) => product.categorySlug === category.slug)
          .length,
      })),
    };
  }
}

export async function getProductRecords() {
  if (!isLiveMode()) {
    return {
      live: false,
      data: demoProducts.map((product) => ({
        id: product.slug,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        barcode: "",
        shortDescription: product.shortDescription,
        description: product.description,
        categoryId: product.categorySlug,
        categoryName:
          demoCategories.find((category) => category.slug === product.categorySlug)?.name ?? "",
        unit: product.unit,
        packSize: product.packSize,
        minimumOrderQuantity: product.minimumOrderQuantity,
        stockOnHand: product.stockOnHand,
        retailPrice: product.retailPrice,
        wholesalePrice: product.wholesalePrice,
        promotionalPrice: null,
        costPrice: product.costPrice,
        lowStockThreshold: product.lowStockThreshold,
        tags: product.tags,
        specifications: {},
        isFeatured: product.isFeatured,
        isActive: true,
        imageUrls: product.images,
      })),
    };
  }

  try {
    const data = await prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return {
      live: true,
      data: data.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        barcode: product.barcode ?? "",
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        categoryId: product.categoryId,
        categoryName: product.category.name,
        unit: product.unit,
        packSize: product.packSize,
        minimumOrderQuantity: product.minimumOrderQuantity,
        stockOnHand: product.stockOnHand,
        retailPrice: Number(product.retailPrice),
        wholesalePrice: Number(product.wholesalePrice),
        promotionalPrice: product.promotionalPrice ? Number(product.promotionalPrice) : null,
        costPrice: Number(product.costPrice),
        lowStockThreshold: product.lowStockThreshold,
        tags: product.tags,
        specifications:
          typeof product.specifications === "object" && product.specifications
            ? (product.specifications as Record<string, string>)
            : {},
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        imageUrls: product.images.map((image) => image.url),
      })),
    };
  } catch {
    return {
      live: false,
      data: demoProducts.map((product) => ({
        id: product.slug,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        barcode: "",
        shortDescription: product.shortDescription,
        description: product.description,
        categoryId: product.categorySlug,
        categoryName:
          demoCategories.find((category) => category.slug === product.categorySlug)?.name ?? "",
        unit: product.unit,
        packSize: product.packSize,
        minimumOrderQuantity: product.minimumOrderQuantity,
        stockOnHand: product.stockOnHand,
        retailPrice: product.retailPrice,
        wholesalePrice: product.wholesalePrice,
        promotionalPrice: null,
        costPrice: product.costPrice,
        lowStockThreshold: product.lowStockThreshold,
        tags: product.tags,
        specifications: {},
        isFeatured: product.isFeatured,
        isActive: true,
        imageUrls: product.images,
      })),
    };
  }
}

export async function getOrderRecords() {
  if (!isLiveMode()) {
    return {
      live: false,
      data: [],
    };
  }

  try {
    const data = await prisma.order.findMany({
      where: { deletedAt: null },
      include: {
        customer: true,
        items: {
          orderBy: { productName: "asc" },
          take: 3,
        },
        notifications: {
          where: {
            orderId: { not: null },
            readAt: null,
            status: { not: "READ" },
            channel: "IN_APP",
          },
          select: { id: true },
        },
      },
      orderBy: { placedAt: "desc" },
    });

    return {
      live: true,
      data: data.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        customerName: order.customer?.companyName ?? "Guest",
        total: Number(order.total),
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverCity: order.receiverCity,
        receiverGovernorate: order.receiverGovernorate,
        receiverAddressLine: order.receiverAddressLine,
        customerNotes: order.customerNotes ?? "",
        placedAt: order.placedAt.toISOString(),
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,
        itemsCount: order.itemsCount,
        itemsPreview: order.items.map((item) => item.productName).slice(0, 3),
        isNew: order.notifications.length > 0,
      })),
    };
  } catch {
    return {
      live: false,
      data: [],
    };
  }
}

export async function getCustomerRecords() {
  if (!isLiveMode()) {
    return {
      live: false,
      data: demoCustomers.map((customer) => ({
        id: customer.code,
        companyName: customer.companyName,
        contactName: customer.contactName,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        governorate: customer.governorate,
        isActive: true,
      })),
    };
  }

  try {
    const data = await prisma.customer.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
    });

    return {
      live: true,
      data: data.map((customer) => ({
        id: customer.id,
        companyName: customer.companyName,
        contactName: customer.contactName,
        email: customer.email ?? "",
        phone: customer.phone,
        city: customer.city ?? "",
        governorate: customer.governorate ?? "",
        isActive: customer.isActive,
      })),
    };
  } catch {
    return {
      live: false,
      data: demoCustomers.map((customer) => ({
        id: customer.code,
        companyName: customer.companyName,
        contactName: customer.contactName,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        governorate: customer.governorate,
        isActive: true,
      })),
    };
  }
}
