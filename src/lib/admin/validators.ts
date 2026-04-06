import { OrderStatus } from "@prisma/client";
import { z } from "zod";

const imageReferenceSchema = z.string().trim().refine((value) => {
  if (value.startsWith("/")) {
    return true;
  }

  return z.string().url().safeParse(value).success;
}, "Invalid image reference");

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(2),
  image: imageReferenceSchema.optional().or(z.literal("")),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  shortDescription: z.string().min(2),
  description: z.string().min(8),
  categoryId: z.string().min(1),
  unit: z.string().min(1),
  packSize: z.coerce.number().int().positive(),
  minimumOrderQuantity: z.coerce.number().int().positive(),
  stockOnHand: z.coerce.number().int().min(0),
  retailPrice: z.coerce.number().positive(),
  wholesalePrice: z.coerce.number().positive(),
  costPrice: z.coerce.number().positive(),
  lowStockThreshold: z.coerce.number().int().min(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  imageUrls: z.array(imageReferenceSchema).min(1),
});

export const orderUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  receiverName: z.string().min(2),
  receiverPhone: z.string().min(8),
  receiverCity: z.string().min(2),
  receiverGovernorate: z.string().min(2),
  receiverAddressLine: z.string().min(5),
  customerNotes: z.string().optional().or(z.literal("")),
});

export const customerSchema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  city: z.string().min(2),
  governorate: z.string().min(2),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
