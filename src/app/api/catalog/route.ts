import { NextResponse } from "next/server";

import { categories, products } from "@/lib/demo-data";

export function GET() {
  return NextResponse.json({
    categories,
    products,
  });
}
