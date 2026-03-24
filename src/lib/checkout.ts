import { z } from "zod";

export const checkoutItemSchema = z.object({
  sku: z.string().min(2),
  quantity: z.coerce.number().int().positive(),
});

export const checkoutPayloadSchema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  governorate: z.string().min(2),
  city: z.string().min(2),
  addressLine: z.string().min(6),
  notes: z.string().optional().or(z.literal("")),
  cashOnDelivery: z.boolean(),
  items: z.array(checkoutItemSchema).min(1),
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;

export function createOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const serial = `${Date.now()}`.slice(-6);
  return `CMD-${year}-${serial}`;
}

export function createInvoiceNumber(orderNumber: string) {
  return `FAC-${orderNumber.replace("CMD-", "")}`;
}

export function createTrackingNumber(orderNumber: string) {
  return `TRK-${orderNumber.replace("CMD-", "")}`;
}

export function createCustomerCode() {
  return `CUS-${Date.now().toString().slice(-6)}`;
}
