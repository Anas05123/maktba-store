"use client";

import Link from "next/link";

import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTnd } from "@/lib/format";
import { reportingSnapshots } from "@/lib/operations";

const report = reportingSnapshots[0]!;

export default function AdminReportsPage() {
  const summaryRows = [
    { metric: "Chiffre d'affaires", value: formatTnd(report.revenue) },
    { metric: "Commandes", value: `${report.orders}` },
    { metric: "Panier moyen", value: formatTnd(report.avgOrderValue) },
    { metric: "Livraison", value: formatTnd(report.deliveryCosts) },
    { metric: "Charges", value: formatTnd(report.expenses) },
    { metric: "Profit estime", value: formatTnd(report.estimatedProfit) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/50">Reporting</p>
          <h1 className="mt-2 text-3xl font-semibold">{report.periodLabel}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Synthese financiere, commerciale et produit pour la periode selectionnee.
          </p>
        </div>
        <Link
          href="/admin/reports/export"
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Exporter le rapport PDF
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryRows.slice(0, 3).map((item) => (
          <Card key={item.metric} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">{item.metric}</p>
              <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Resume KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { accessorKey: "metric", header: "Indicateur" },
                { accessorKey: "value", header: "Valeur" },
              ]}
              data={summaryRows}
              variant="dark"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Top categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.topCategories.map((category) => (
                <div key={category.category} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
                  <span>{category.category}</span>
                  <span className="font-semibold">{formatTnd(category.revenue)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Top produits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.topProducts.map((product) => (
                <div key={product.name} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-white/50">{product.quantitySold} unites</p>
                  </div>
                  <span className="font-semibold">{formatTnd(product.revenue)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
