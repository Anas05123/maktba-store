import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(16).optional(),
  DEMO_ADMIN_EMAIL: z.string().email().optional(),
  DEMO_ADMIN_PASSWORD: z.string().min(8).optional(),
});

const parsed = envSchema.safeParse(process.env);

export const env = parsed.success ? parsed.data : {};

export const hasDatabaseUrl = Boolean(env.DATABASE_URL);
