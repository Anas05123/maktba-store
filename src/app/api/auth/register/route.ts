import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(8),
});

function createCustomerCode() {
  return `CUS-${Date.now().toString().slice(-6)}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Formulaire invalide." }, { status: 400 });
  }

  const data = parsed.data;
  const email = data.email.trim().toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Un compte existe deja avec cette adresse email." },
        { status: 409 },
      );
    }

    const role = await prisma.role.findUnique({
      where: { key: "CUSTOMER" },
    });

    if (!role) {
      return NextResponse.json(
        { message: "Role client introuvable. Lancez le seed Prisma d'abord." },
        { status: 500 },
      );
    }

    const passwordHash = await hash(data.password, 10);

    const customer = await prisma.customer.create({
      data: {
        code: createCustomerCode(),
        type: "RETAIL" as const,
        companyName: `${data.firstName} ${data.lastName}`.trim(),
        contactName: `${data.firstName} ${data.lastName}`.trim(),
        email,
        phone: data.phone,
        city: "Tunis",
        governorate: "Tunis",
      },
    });

    const user = await prisma.user.create({
      data: {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email,
        phone: data.phone,
        passwordHash,
        roleId: role.id,
        customerId: customer.id,
      },
    });

    await prisma.customerProfile.create({
      data: {
        userId: user.id,
        customerId: customer.id,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    return NextResponse.json({ message: "Compte client cree avec succes." }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Inscription indisponible. Verifiez PostgreSQL et reessayez." },
      { status: 503 },
    );
  }
}
