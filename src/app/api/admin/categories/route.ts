import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { categorySchema } from "@/lib/admin/validators";
import { dbUnavailableResponse, getCategoryRecords, isLiveMode, requireAdminApi } from "@/lib/admin/cms";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const records = await getCategoryRecords();
  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  if (!isLiveMode()) return dbUnavailableResponse();

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        image: parsed.data.image || null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/");

    return NextResponse.json({ message: "Category created" });
  } catch {
    return dbUnavailableResponse();
  }
}
