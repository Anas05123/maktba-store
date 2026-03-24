"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { financeReport, monthlyPerformance, topProducts } from "@/lib/demo-data";
import { formatTnd } from "@/lib/format";

const performanceColumns: ColumnDef<(typeof monthlyPerformance)[number]>[] = [
  { accessorKey: "month", header: "Mois" },
  {
    accessorKey: "revenue",
    header: "Chiffre",
    cell: ({ row }) => formatTnd(row.original.revenue),
  },
  {
    accessorKey: "profit",
    header: "Profit",
    cell: ({ row }) => formatTnd(row.original.profit),
  },
  {
    accessorKey: "expenses",
    header: "Charges",
    cell: ({ row }) => formatTnd(row.original.expenses),
  },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
          <CardContent className="p-6">
            <p className="text-sm text-white/60">Resultat net</p>
            <p className="mt-2 text-3xl font-semibold">{formatTnd(financeReport.netProfit)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
          <CardContent className="p-6">
            <p className="text-sm text-white/60">Produits suivis</p>
            <p className="mt-2 text-3xl font-semibold">{topProducts.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
          <CardContent className="p-6">
            <p className="text-sm text-white/60">Periode</p>
            <p className="mt-2 text-3xl font-semibold">Q1</p>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={performanceColumns} data={monthlyPerformance} variant="dark" />

      <div className="grid gap-4 lg:grid-cols-2">
        {topProducts.map((product) => (
          <Card key={product.sku} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-white/60">{product.categoryName}</p>
                </div>
                <p className="font-semibold">{formatTnd(product.revenue)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
