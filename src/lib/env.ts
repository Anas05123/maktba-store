import { z } from "zod";

const envSchema = z
  .object({
    DATABASE_URL: z.string().trim().min(1).optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(16).optional(),
    DEMO_ADMIN_EMAIL: z.string().email().optional(),
    DEMO_ADMIN_PASSWORD: z.string().min(8).optional(),
  })
  .partial();

const parsed = envSchema.safeParse(process.env);

export const env = {
  DATABASE_URL: process.env.DATABASE_URL?.trim(),
  NEXTAUTH_URL: parsed.success ? parsed.data.NEXTAUTH_URL : undefined,
  NEXTAUTH_SECRET: parsed.success ? parsed.data.NEXTAUTH_SECRET : undefined,
  DEMO_ADMIN_EMAIL: parsed.success ? parsed.data.DEMO_ADMIN_EMAIL : undefined,
  DEMO_ADMIN_PASSWORD: parsed.success ? parsed.data.DEMO_ADMIN_PASSWORD : undefined,
};

export const hasDatabaseUrl = Boolean(env.DATABASE_URL);
