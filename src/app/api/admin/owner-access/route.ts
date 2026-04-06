import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createOwnerAccessToken,
  getOwnerAccessMaxAge,
  isValidOwnerFinancePassword,
  OWNER_ACCESS_COOKIE,
} from "@/lib/admin/owner-access";

const ownerAccessSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = ownerAccessSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Mot de passe proprietaire invalide." },
      { status: 400 },
    );
  }

  if (!isValidOwnerFinancePassword(parsed.data.password)) {
    return NextResponse.json(
      { message: "Mot de passe proprietaire incorrect." },
      { status: 401 },
    );
  }

  const store = await cookies();
  store.set(OWNER_ACCESS_COOKIE, createOwnerAccessToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getOwnerAccessMaxAge(),
  });

  return NextResponse.json({ ok: true, message: "Acces proprietaire active." });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(OWNER_ACCESS_COOKIE);

  return NextResponse.json({ ok: true, message: "Acces proprietaire verrouille." });
}
