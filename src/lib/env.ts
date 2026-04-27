import { z } from "zod";

const envSchema = z
  .object({
    DATABASE_URL: z.string().trim().min(1).optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(16).optional(),
    DEMO_ADMIN_EMAIL: z.string().email().optional(),
    DEMO_ADMIN_PASSWORD: z.string().min(8).optional(),
    OWNER_FINANCE_PASSWORD: z.string().min(8).optional(),
    DEEPSEEK_API_KEY: z.string().min(20).optional(),
    DEEPSEEK_MODEL: z.string().min(1).optional(),
    DEEPSEEK_BASE_URL: z.string().url().optional(),
  })
  .partial();

const parsed = envSchema.safeParse(process.env);

export const env = {
  DATABASE_URL: process.env.DATABASE_URL?.trim(),
  NEXTAUTH_URL: parsed.success ? parsed.data.NEXTAUTH_URL : undefined,
  NEXTAUTH_SECRET: parsed.success ? parsed.data.NEXTAUTH_SECRET : undefined,
  DEMO_ADMIN_EMAIL: parsed.success ? parsed.data.DEMO_ADMIN_EMAIL : undefined,
  DEMO_ADMIN_PASSWORD: parsed.success ? parsed.data.DEMO_ADMIN_PASSWORD : undefined,
  OWNER_FINANCE_PASSWORD:
    process.env.OWNER_FINANCE_PASSWORD?.trim() ||
    (parsed.success ? parsed.data.OWNER_FINANCE_PASSWORD : undefined),
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY?.trim(),
  DEEPSEEK_MODEL:
    process.env.DEEPSEEK_MODEL?.trim() ||
    (parsed.success ? parsed.data.DEEPSEEK_MODEL : undefined),
  DEEPSEEK_BASE_URL:
    process.env.DEEPSEEK_BASE_URL?.trim() ||
    (parsed.success ? parsed.data.DEEPSEEK_BASE_URL : undefined),
};

export const hasDatabaseUrl = Boolean(env.DATABASE_URL);
export const hasDeepSeekAssistant = Boolean(env.DEEPSEEK_API_KEY);
