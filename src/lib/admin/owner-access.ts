import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

export const OWNER_ACCESS_COOKIE = "maktba-owner-access";
const OWNER_ACCESS_TTL_SECONDS = 60 * 60 * 2;
const OWNER_ACCESS_DEFAULT_PASSWORD = "OwnerFinance123!";

export function getOwnerFinancePassword() {
  return env.OWNER_FINANCE_PASSWORD ?? OWNER_ACCESS_DEFAULT_PASSWORD;
}

function getOwnerAccessSigningSecret() {
  return `${env.NEXTAUTH_SECRET ?? "maktba-owner-access-secret"}:${getOwnerFinancePassword()}`;
}

function signValue(value: string) {
  return createHmac("sha256", getOwnerAccessSigningSecret()).update(value).digest("base64url");
}

export function createOwnerAccessToken() {
  const issuedAt = Date.now().toString();
  const signature = signValue(issuedAt);
  return `${issuedAt}.${signature}`;
}

export function isValidOwnerFinancePassword(input: string) {
  const expected = Buffer.from(signValue(getOwnerFinancePassword()));
  const received = Buffer.from(signValue(input));

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function verifyOwnerAccessToken(token?: string | null) {
  if (!token) {
    return false;
  }

  const [issuedAtRaw, signature] = token.split(".");
  if (!issuedAtRaw || !signature) {
    return false;
  }

  const expectedSignature = signValue(issuedAtRaw);
  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return false;
  }

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  return Date.now() - issuedAt <= OWNER_ACCESS_TTL_SECONDS * 1000;
}

export function getOwnerAccessMaxAge() {
  return OWNER_ACCESS_TTL_SECONDS;
}

export async function hasOwnerFinanceAccess() {
  const store = await cookies();
  return verifyOwnerAccessToken(store.get(OWNER_ACCESS_COOKIE)?.value);
}
