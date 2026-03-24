"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ProfitTrendChart } from "@/components/admin/performance-chart";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  expenseBreakdown,
  expenses,
  financeReport,
  monthlyPerformance,
} from "@/lib/demo-data";
import { formatTnd } from "@/lib/format";

const columns: ColumnDef<(typeof expenses)[number]>[] = [
  { accessorKey: "title", header: "Depense" },
  { accessorKey: "category", header: "Categorie" },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => formatTnd(row.original.amount),
  },
  { accessorKey: "reference", header: "Reference" },
];

export default function AdminFinancePage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Chiffre brut", value: financeReport.grossRevenue },
          { label: "Profit brut", value: financeReport.grossProfit },
          { label: "Charges", value: financeReport.operatingExpenses },
          { label: "Resultat net", value: financeReport.netProfit },
        ].map((item) => (
          <Card key={item.label} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold">{formatTnd(item.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ProfitTrendChart data={monthlyPerformance} />
        <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Repartition des charges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenseBreakdown.map((expense) => (
              <div
                key={expense.category}
                className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <span>{expense.category}</span>
                <span className="font-semibold">{formatTnd(expense.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={expenses} variant="dark" />
    </div>
  );
}
