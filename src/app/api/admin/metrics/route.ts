import { NextResponse } from "next/server";

import {
  dashboardSummary,
  expenseBreakdown,
  financeReport,
  monthlyPerformance,
  topProducts,
} from "@/lib/demo-data";

export function GET() {
  return NextResponse.json({
    dashboardSummary,
    financeReport,
    expenseBreakdown,
    monthlyPerformance,
    topProducts,
  });
}
