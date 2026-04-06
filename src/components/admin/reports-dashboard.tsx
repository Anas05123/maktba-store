"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarRange, FileDown, PackageSearch, TrendingUp, Truck } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OwnerAccessPanel } from "@/components/admin/owner-access-panel";
import { formatTnd } from "@/lib/format";
import { getReportSlug, reportingSnapshots } from "@/lib/operations";

const baseReport = reportingSnapshots[0]!;

const reportViews = {
  "7d": {
    label: "7 derniers jours",
    revenue: Math.round(baseReport.revenue * 0.25),
    orders: Math.max(Math.round(baseReport.orders * 0.22), 1),
    avgOrderValue: Math.round(baseReport.avgOrderValue * 1000) / 1000,
    deliveryCosts: Math.round(baseReport.deliveryCosts * 0.24),
    expenses: Math.round(baseReport.expenses * 0.18),
    estimatedProfit: Math.round(baseReport.estimatedProfit * 0.27),
  },
  "30d": {
    label: "30 derniers jours",
    revenue: baseReport.revenue,
    orders: baseReport.orders,
    avgOrderValue: baseReport.avgOrderValue,
    deliveryCosts: baseReport.deliveryCosts,
    expenses: baseReport.expenses,
    estimatedProfit: baseReport.estimatedProfit,
  },
  "90d": {
    label: "3 derniers mois",
    revenue: Math.round(baseReport.revenue * 2.6),
    orders: Math.round(baseReport.orders * 2.7),
    avgOrderValue: baseReport.avgOrderValue,
    deliveryCosts: Math.round(baseReport.deliveryCosts * 2.5),
    expenses: Math.round(baseReport.expenses * 2.6),
    estimatedProfit: Math.round(baseReport.estimatedProfit * 2.7),
  },
  "12m": {
    label: "12 derniers mois",
    revenue: Math.round(baseReport.revenue * 10.4),
    orders: Math.round(baseReport.orders * 10.8),
    avgOrderValue: baseReport.avgOrderValue,
    deliveryCosts: Math.round(baseReport.deliveryCosts * 10.1),
    expenses: Math.round(baseReport.expenses * 10.3),
    estimatedProfit: Math.round(baseReport.estimatedProfit * 10.6),
  },
} as const;

export function ReportsDashboard() {
  const [selectedView, setSelectedView] =
    useState<keyof typeof reportViews>("30d");

  const current = reportViews[selectedView];
  const summaryRows = [
    { metric: "Chiffre d'affaires", value: formatTnd(current.revenue) },
    { metric: "Commandes", value: `${current.orders}` },
    { metric: "Panier moyen", value: formatTnd(current.avgOrderValue) },
    { metric: "Livraison", value: formatTnd(current.deliveryCosts) },
    { metric: "Charges", value: formatTnd(current.expenses) },
    { metric: "Profit estime", value: formatTnd(current.estimatedProfit) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[32px] border-white/10 bg-slate-900 bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(15,23,42,0.96))] p-6 text-white shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/45">Reporting proprietaire</p>
              <h1 className="mt-2 text-3xl font-semibold">Rapports & pilotage</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
                Choisissez la periode qui compte pour vous et exportez un PDF propre quand vous voulez partager les chiffres.
              </p>
            </div>
            <Link
              href={`/documents/reports/${getReportSlug(baseReport)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              <FileDown className="size-4" />
              Exporter le rapport PDF
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(Object.entries(reportViews) as Array<
              [keyof typeof reportViews, (typeof reportViews)[keyof typeof reportViews]]
            >).map(([key, item]) => (
              <Button
                key={key}
                variant={selectedView === key ? "default" : "outline"}
                className={
                  selectedView === key
                    ? "rounded-full"
                    : "rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                }
                onClick={() => setSelectedView(key)}
              >
                <CalendarRange className="size-4" />
                {item.label}
              </Button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Vue periodique",
                value: current.label,
                note: "Passez de la semaine au trimestre sans quitter la page.",
              },
              {
                label: "Performance livraison",
                value: current.deliveryCosts <= current.revenue * 0.12 ? "Sous controle" : "A surveiller",
                note: "Lecture rapide pour savoir si les frais montent trop vite.",
              },
              {
                label: "Top moteur",
                value: baseReport.topCategories[0]?.category ?? "Categorie",
                note: "Le rayon qui tire le plus le chiffre sur cette maquette.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/55">{item.label}</p>
                <p className="mt-2 text-xl font-semibold">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">{item.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <OwnerAccessPanel
          title="Rapports sensibles"
          description="Les exports, les comparaisons et les chiffres profitables restent reserves au proprietaire."
          unlocked
        />
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
              <CardTitle>Ce que le proprietaire regarde d&apos;abord</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {[
                {
                  icon: TrendingUp,
                  title: "Est-ce que la marge tient ?",
                  text: `Profit estime sur la periode: ${formatTnd(current.estimatedProfit)}.`,
                },
                {
                  icon: Truck,
                  title: "La livraison coute-t-elle trop ?",
                  text: `Frais de livraison: ${formatTnd(current.deliveryCosts)}.`,
                },
                {
                  icon: PackageSearch,
                  title: "Quels rayons poussent la vente ?",
                  text: `${baseReport.topCategories[0]?.category ?? "Papeterie"} reste en tete.`,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <p className="mt-4 font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/60">{item.text}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Top categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {baseReport.topCategories.map((category) => (
                <div key={category.category} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
                  <span>{category.category}</span>
                  <span className="font-semibold">{formatTnd(category.revenue)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
