import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "maktba-pro-wholesale",
    timestamp: new Date().toISOString(),
  });
}
