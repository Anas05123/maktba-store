import { NextResponse } from "next/server";

import { getStorefrontApiData } from "@/lib/storefront";

export async function GET() {
  const { categories, products } = await getStorefrontApiData();

  return NextResponse.json({
    categories,
    products,
  });
}
