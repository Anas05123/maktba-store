import { NextRequest, NextResponse } from "next/server";

import { checkoutPayloadSchema, createCustomerCode, createInvoiceNumber, createOrderNumber, createTrackingNumber } from "@/lib/checkout";
import { hasDatabaseUrl } from "@/lib/env";
import { products as demoProducts } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = checkoutPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Checkout invalide." }, { status: 400 });
  }

  const payload = parsed.data;
  const orderNumber = createOrderNumber();
  const invoiceNumber = createInvoiceNumber(orderNumber);
  const trackingNumber = createTrackingNumber(orderNumber);

  if (!hasDatabaseUrl) {
    return NextResponse.json({
      live: false,
      message: "Commande preparee en mode demo.",
      orderNumber,
    });
  }

  try {
    const liveProducts = await prisma.product.findMany({
      where: {
        sku: { in: payload.items.map((item) => item.sku) },
        deletedAt: null,
      },
    });

    const productMap = new Map(liveProducts.map((product) => [product.sku, product]));
    const fallbackMap = new Map(demoProducts.map((product) => [product.sku, product]));

    const lineItems = payload.items.map((item) => {
      const liveProduct = productMap.get(item.sku);
      const fallbackProduct = fallbackMap.get(item.sku);
      const productName = liveProduct?.name ?? fallbackProduct?.name ?? item.sku;
      const unitPrice = Number(liveProduct?.retailPrice ?? fallbackProduct?.retailPrice ?? 0);
      const unitCost = Number(liveProduct?.costPrice ?? fallbackProduct?.costPrice ?? 0);

      return {
        sku: item.sku,
        productId: liveProduct?.id,
        productName,
        unitPrice,
        unitCost,
        quantity: item.quantity,
        total: unitPrice * item.quantity,
      };
    });

    if (lineItems.some((item) => !item.productId)) {
      return NextResponse.json(
        {
          message:
            "Un ou plusieurs produits du panier ne sont pas synchronises avec la base de donnees.",
        },
        { status: 400 },
      );
    }

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const shippingFee = subtotal >= 120 ? 0 : 12;
    const total = subtotal + shippingFee;
    const costTotal = lineItems.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);

    let customer = await prisma.customer.findFirst({
      where: { email: payload.email.trim().toLowerCase(), deletedAt: null },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          code: createCustomerCode(),
          type: "RETAIL",
          companyName: payload.companyName,
          contactName: payload.contactName,
          email: payload.email.trim().toLowerCase(),
          phone: payload.phone,
          city: payload.city,
          governorate: payload.governorate,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        customerId: customer.id,
        type: "SHIPPING",
        label: "Adresse checkout",
        contactName: payload.contactName,
        phone: payload.phone,
        line1: payload.addressLine,
        city: payload.city,
        governorate: payload.governorate,
        postalCode: "1000",
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        channel: "DIRECT_SALES",
        status: "PENDING",
        fulfillmentStatus: "CONFIRMED",
        packagingStatus: "NOT_STARTED",
        deliveryStatus: "NOT_ASSIGNED",
        paymentStatus: "PENDING",
        paymentMethod: payload.cashOnDelivery ? "CASH_ON_DELIVERY" : "BANK_TRANSFER",
        subtotal,
        shippingFee,
        total,
        costTotal,
        profitEstimate: total - costTotal,
        itemsCount: payload.items.reduce((sum, item) => sum + item.quantity, 0),
        shippingAddressId: address.id,
        billingAddressId: address.id,
        receiverName: payload.contactName,
        receiverCompany: payload.companyName,
        receiverPhone: payload.phone,
        receiverEmail: payload.email,
        receiverAddressLine: payload.addressLine,
        receiverCity: payload.city,
        receiverGovernorate: payload.governorate,
        billingName: payload.contactName,
        billingPhone: payload.phone,
        billingEmail: payload.email,
        billingAddressLine: payload.addressLine,
        billingCity: payload.city,
        billingGovernorate: payload.governorate,
        customerNotes: payload.notes || null,
        items: {
          create: lineItems.map((item) => ({
            productId: item.productId!,
            productName: item.productName,
            productSlug:
              (productMap.get(item.sku)?.slug ?? fallbackMap.get(item.sku)?.slug) || null,
            productImageUrl:
              fallbackMap.get(item.sku)?.images[0] || null,
            sku: item.sku,
            unitCost: item.unitCost,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            total: item.total,
          })),
        },
        payments: {
          create: [
            {
              amount: total,
              currency: "TND",
              method: payload.cashOnDelivery ? "CASH_ON_DELIVERY" : "BANK_TRANSFER",
              status: "PENDING",
            },
          ],
        },
        invoice: {
          create: {
            invoiceNumber,
            customerId: customer.id,
            billingAddressId: address.id,
            status: "ISSUED",
            subtotal,
            shippingAmount: shippingFee,
            total,
            items: {
              create: lineItems.map((item) => ({
                productId: item.productId ?? null,
                label: item.productName,
                sku: item.sku,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
              })),
            },
          },
        },
        delivery: {
          create: {
            customerId: customer.id,
            addressId: address.id,
            method: "STANDARD",
            courierCompany: "A affecter",
            trackingNumber,
            status: "NOT_ASSIGNED",
            receiverName: payload.contactName,
            receiverPhone: payload.phone,
            notes: "Commande issue du checkout web.",
            events: {
              create: [
                {
                  status: "NOT_ASSIGNED",
                  description: "Commande en attente d'affectation transport.",
                },
              ],
            },
          },
        },
        fulfillmentHistory: {
          create: [{ status: "CONFIRMED", note: "Commande recue via le site." }],
        },
        packagingHistory: {
          create: [{ status: "NOT_STARTED", note: "Attente de preparation logistique." }],
        },
      },
    });

    return NextResponse.json({
      live: true,
      message: "Commande enregistree avec succes.",
      orderNumber: order.orderNumber,
      invoiceNumber,
    });
  } catch {
    return NextResponse.json(
      { message: "Impossible d'enregistrer la commande pour le moment." },
      { status: 500 },
    );
  }
}
