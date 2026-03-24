import { PrismaClient, RoleKey } from "@prisma/client";

import {
  demoBrands,
  demoCategories,
  demoCustomers,
  demoExpenses,
  demoOrders,
  demoProducts,
  demoSuppliers,
} from "../src/data/demo-store";

const prisma = new PrismaClient();

async function main() {
  await prisma.stockMovement.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.productPriceTier.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.supplierProduct.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  const roles = await Promise.all(
    [
      {
        key: RoleKey.ADMIN,
        name: "Admin",
        description: "Full platform access and configuration rights.",
      },
      {
        key: RoleKey.MANAGER,
        name: "Manager",
        description: "Operational management for catalog, stock, and orders.",
      },
      {
        key: RoleKey.STAFF,
        name: "Staff",
        description: "Warehouse, support, and invoicing workflows.",
      },
      {
        key: RoleKey.CUSTOMER,
        name: "Customer",
        description: "Wholesale portal access for B2B buyers.",
      },
    ].map((role) => prisma.role.create({ data: role })),
  );

  const roleByKey = new Map(roles.map((role) => [role.key, role]));

  const adminUser = await prisma.user.create({
    data: {
      name: "Maktba Admin",
      email: process.env.DEMO_ADMIN_EMAIL ?? "admin@maktba.tn",
      phone: "+216 20 300 300",
      roleId: roleByKey.get(RoleKey.ADMIN)!.id,
      isActive: true,
    },
  });

  const categories = await Promise.all(
    demoCategories.map((category) =>
      prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
        },
      }),
    ),
  );
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

  const brands = await Promise.all(
    demoBrands.map((brand) =>
      prisma.brand.create({
        data: {
          name: brand.name,
          slug: brand.slug,
          country: brand.country,
        },
      }),
    ),
  );
  const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));

  const suppliers = await Promise.all(
    demoSuppliers.map((supplier) =>
      prisma.supplier.create({
        data: {
          code: supplier.code,
          slug: supplier.slug,
          name: supplier.name,
          contactName: supplier.contactName,
          phone: supplier.phone,
          email: supplier.email,
          city: supplier.city,
          governorate: supplier.governorate,
          paymentTermsDays: supplier.paymentTermsDays,
          notes: supplier.note,
        },
      }),
    ),
  );
  const supplierByCode = new Map(suppliers.map((supplier) => [supplier.code, supplier]));

  const customers = await Promise.all(
    demoCustomers.map((customer, index) =>
      prisma.customer.create({
        data: {
          code: customer.code,
          type: customer.type,
          companyName: customer.companyName,
          contactName: customer.contactName,
          phone: customer.phone,
          email: customer.email,
          governorate: customer.governorate,
          city: customer.city,
          paymentTermsDays: customer.paymentTermsDays,
          creditLimit: customer.creditLimit,
          lifetimeValue: customer.lifetimeValue,
          addresses: {
            create: [
              {
                type: "SHIPPING",
                label: "Depot principal",
                contactName: customer.contactName,
                phone: customer.phone,
                line1: `Zone pro ${index + 1}, avenue centrale`,
                city: customer.city,
                governorate: customer.governorate,
                postalCode: "1000",
                isDefault: true,
              },
              {
                type: "BILLING",
                label: "Facturation",
                contactName: customer.contactName,
                phone: customer.phone,
                line1: `Immeuble administratif ${index + 4}`,
                city: customer.city,
                governorate: customer.governorate,
                postalCode: "1000",
                isDefault: true,
              },
            ],
          },
        },
      }),
    ),
  );
  const customerByCode = new Map(customers.map((customer) => [customer.code, customer]));

  const products = new Map<string, Awaited<ReturnType<typeof prisma.product.create>>>();

  for (const product of demoProducts) {
    const createdProduct = await prisma.product.create({
      data: {
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        unit: product.unit,
        packSize: product.packSize,
        minimumOrderQuantity: product.minimumOrderQuantity,
        stockOnHand: product.stockOnHand,
        costPrice: product.costPrice,
        wholesalePrice: product.wholesalePrice,
        retailPrice: product.retailPrice,
        lowStockThreshold: product.lowStockThreshold,
        isFeatured: product.isFeatured,
        categoryId: categoryBySlug.get(product.categorySlug)!.id,
        brandId: brandBySlug.get(product.brandSlug)!.id,
        preferredSupplierId: supplierByCode.get(product.preferredSupplierCode)!.id,
        images: {
          create: product.images.map((url, index) => ({
            url,
            altText: product.name,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        },
        priceTiers: {
          create: product.priceTiers.map((tier) => {
            const priceTier = {
              label: tier.label,
              minQuantity: tier.minQuantity,
              price: tier.price,
              customerType: tier.customerType ?? "WHOLESALE",
            };

            return tier.maxQuantity === undefined
              ? priceTier
              : { ...priceTier, maxQuantity: tier.maxQuantity };
          }),
        },
        supplierOfferings: {
          create: product.supplierOffers.map((offer) => ({
            supplierId: supplierByCode.get(offer.supplierCode)!.id,
            costPrice: offer.costPrice,
            leadTimeDays: offer.leadTimeDays,
            minimumOrderQuantity: offer.minimumOrderQuantity,
            isPreferred: offer.isPreferred ?? false,
          })),
        },
        ...(product.variants
          ? {
              variants: {
                create: product.variants.map((variant) => ({
                  sku: variant.sku,
                  title: variant.title,
                  attributes: variant.attributes,
                  quantityOnHand: variant.quantityOnHand,
                  wholesalePrice: variant.wholesalePrice ?? product.wholesalePrice,
                  retailPrice: variant.retailPrice ?? product.retailPrice,
                  costPrice: product.costPrice,
                })),
              },
            }
          : {}),
      },
    });

    await prisma.inventoryLog.create({
      data: {
        productId: createdProduct.id,
        logDate: new Date("2026-03-24T00:00:00.000Z"),
        openingStock: product.stockOnHand + 36,
        stockIn: 120,
        stockOut: 120 + 36 - product.stockOnHand,
        adjustments: 0,
        closingStock: product.stockOnHand,
        reorderPoint: product.lowStockThreshold,
        stockValue: product.stockOnHand * product.costPrice,
      },
    });

    await prisma.stockMovement.create({
      data: {
        productId: createdProduct.id,
        supplierId: supplierByCode.get(product.preferredSupplierCode)!.id,
        type: "PURCHASE",
        reference: `PO-${product.sku}`,
        quantityChange: 120,
        quantityBefore: product.stockOnHand - 24,
        quantityAfter: product.stockOnHand + 96,
        unitCost: product.costPrice,
        performedById: adminUser.id,
        notes: "Initial wholesale replenishment batch.",
        createdAt: new Date("2026-03-10T09:00:00.000Z"),
      },
    });

    products.set(product.sku, createdProduct);
  }

  for (const expense of demoExpenses) {
    await prisma.expense.create({
      data: {
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        expenseDate: new Date(expense.expenseDate),
        recordedById: adminUser.id,
        ...(expense.reference ? { reference: expense.reference } : {}),
        ...(expense.supplierCode
          ? { supplierId: supplierByCode.get(expense.supplierCode)?.id ?? null }
          : {}),
      },
    });
  }

  for (const order of demoOrders) {
    const customer = customerByCode.get(order.customerCode)!;
    const addresses = await prisma.address.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: "asc" },
    });
    const shippingAddress = addresses.find((address) => address.type === "SHIPPING");
    const billingAddress = addresses.find((address) => address.type === "BILLING");

    const subtotal = order.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const costTotal = order.items.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    );
    const total = subtotal + order.shippingFee;

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber: order.orderNumber,
        customerId: customer.id,
        createdById: adminUser.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal,
        shippingFee: order.shippingFee,
        total,
        costTotal,
        profitEstimate: total - costTotal,
        itemsCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        receiverName: order.receiverName,
        receiverCompany: customer.companyName,
        receiverPhone: order.receiverPhone,
        receiverEmail: customer.email,
        receiverAddressLine: order.receiverAddressLine,
        receiverCity: order.receiverCity,
        receiverGovernorate: order.receiverGovernorate,
        placedAt: new Date(order.placedAt),
        items: {
          create: order.items.map((item) => {
            const product = products.get(item.sku)!;
            return {
              productId: product.id,
              productName: product.name,
              sku: product.sku,
              unitCost: item.unitCost,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              total: item.unitPrice * item.quantity,
            };
          }),
        },
        payments: {
          create: [
            {
              amount:
                order.paymentStatus === "PENDING"
                  ? 0
                  : order.paymentStatus === "PARTIALLY_PAID"
                    ? total * 0.4
                    : total,
              method: order.paymentMethod,
              status: order.paymentStatus,
              dueAt: new Date(order.placedAt),
              receivedById: adminUser.id,
              ...(order.paymentStatus === "PENDING"
                ? {}
                : { paidAt: new Date(order.placedAt) }),
            },
          ],
        },
        ...(shippingAddress ? { shippingAddressId: shippingAddress.id } : {}),
        ...(billingAddress ? { billingAddressId: billingAddress.id } : {}),
        ...(order.notes ? { customerNotes: order.notes } : {}),
      },
    });

    for (const item of order.items) {
      const product = products.get(item.sku)!;
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          orderId: createdOrder.id,
          type: "SALE",
          reference: order.orderNumber,
          quantityChange: -item.quantity,
          quantityBefore: 0,
          quantityAfter: 0,
          unitCost: item.unitCost,
          performedById: adminUser.id,
          notes: `Sale movement for ${order.orderNumber}`,
          createdAt: new Date(order.placedAt),
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
