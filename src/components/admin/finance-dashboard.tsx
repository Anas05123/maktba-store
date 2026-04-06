"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CalendarRange, CircleDollarSign, CreditCard, PiggyBank, ShieldCheck } from "lucide-react";

import { ProfitTrendChart } from "@/components/admin/performance-chart";
import { DataTable } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OwnerAccessPanel } from "@/components/admin/owner-access-panel";
import {
  expenseBreakdown,
  expenses,
  financeReport,
  monthlyPerformance,
} from "@/lib/demo-data";
import { formatTnd } from "@/lib/format";

type ExpenseRow = (typeof expenses)[number];

const columns: ColumnDef<ExpenseRow>[] = [
  { accessorKey: "title", header: "Depense" },
  { accessorKey: "category", header: "Categorie" },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => formatTnd(row.original.amount),
  },
  { accessorKey: "reference", header: "Reference" },
];

const financePresets = {
  "7d": {
    label: "7 derniers jours",
    revenue: Math.round(financeReport.grossRevenue * 0.24),
    grossProfit: Math.round(financeReport.grossProfit * 0.23),
    operatingExpenses: Math.round(financeReport.operatingExpenses * 0.21),
    netProfit: Math.round(financeReport.netProfit * 0.24),
    note: "Pour verifier rapidement la tendance de la semaine et le cash utile.",
  },
  "30d": {
    label: "30 derniers jours",
    revenue: financeReport.grossRevenue,
    grossProfit: financeReport.grossProfit,
    operatingExpenses: financeReport.operatingExpenses,
    netProfit: financeReport.netProfit,
    note: "La vue la plus pratique pour piloter les ventes, la marge et les charges du mois.",
  },
  "90d": {
    label: "3 derniers mois",
    revenue: monthlyPerformance.reduce((sum, item) => sum + item.revenue, 0),
    grossProfit: monthlyPerformance.reduce((sum, item) => sum + item.profit, 0),
    operatingExpenses: monthlyPerformance.reduce((sum, item) => sum + item.expenses, 0),
    netProfit:
      monthlyPerformance.reduce((sum, item) => sum + item.profit, 0) -
      monthlyPerformance.reduce((sum, item) => sum + item.expenses, 0),
    note: "Ideal pour juger la vraie sante du business avec assez de recul.",
  },
  "12m": {
    label: "12 derniers mois",
    revenue: Math.round(monthlyPerformance.reduce((sum, item) => sum + item.revenue, 0) * 4),
    grossProfit: Math.round(monthlyPerformance.reduce((sum, item) => sum + item.profit, 0) * 4),
    operatingExpenses: Math.round(
      monthlyPerformance.reduce((sum, item) => sum + item.expenses, 0) * 4,
    ),
    netProfit: Math.round(
      (monthlyPerformance.reduce((sum, item) => sum + item.profit, 0) -
        monthlyPerformance.reduce((sum, item) => sum + item.expenses, 0)) *
        4,
    ),
    note: "Pour voir la trajectoire annuelle et arbitrer les gros investissements.",
  },
} as const;

export function FinanceDashboard() {
  const [selectedPreset, setSelectedPreset] =
    useState<keyof typeof financePresets>("30d");

  const preset = financePresets[selectedPreset];
  const cashLeft = preset.revenue - preset.operatingExpenses;
  const profitRate = preset.revenue > 0 ? (preset.netProfit / preset.revenue) * 100 : 0;
  const financeHighlights = [
    {
      label: "Chiffre d'affaires",
      value: preset.revenue,
      note: "Encaissements sur la periode choisie",
      icon: CircleDollarSign,
      tone: "bg-cyan-500/10 text-cyan-200",
    },
    {
      label: "Profit brut",
      value: preset.grossProfit,
      note: "Marge avant charges fixes",
      icon: PiggyBank,
      tone: "bg-emerald-500/10 text-emerald-200",
    },
    {
      label: "Charges",
      value: preset.operatingExpenses,
      note: "Livraison, marketing, exploitation",
      icon: CreditCard,
      tone: "bg-amber-500/10 text-amber-200",
    },
    {
      label: "Resultat net",
      value: preset.netProfit,
      note: "Lecture directe pour le proprietaire",
      icon: ShieldCheck,
      tone: "bg-violet-500/10 text-violet-200",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <Card className="rounded-[32px] border-white/10 bg-slate-900 bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(15,23,42,0.96))] text-white shadow-2xl shadow-slate-950/20">
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.18em] text-white/45">
                  Espace proprietaire
                </p>
                <h1 className="mt-2 text-3xl font-semibold">Finance & tresorerie</h1>
                <p className="max-w-2xl text-sm leading-7 text-white/65">{preset.note}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      title: "Vue active",
                      value: preset.label,
                    },
                    {
                      title: "Cash restant",
                      value: formatTnd(cashLeft),
                    },
                    {
                      title: "Marge nette",
                      value: `${profitRate.toFixed(1)}%`,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                        {item.title}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                  Periode d&apos;analyse
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  {(Object.entries(financePresets) as Array<
                    [
                      keyof typeof financePresets,
                      (typeof financePresets)[keyof typeof financePresets],
                    ]
                  >).map(([key, item]) => (
                    <Button
                      key={key}
                      variant={selectedPreset === key ? "default" : "outline"}
                      className={
                        selectedPreset === key
                          ? "h-11 justify-start rounded-2xl"
                          : "h-11 justify-start rounded-2xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                      }
                      onClick={() => setSelectedPreset(key)}
                    >
                      <CalendarRange className="size-4" />
                      {item.label}
                    </Button>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-white/50">
                  Passez rapidement de la semaine au trimestre pour piloter la tresorerie sans ouvrir plusieurs rapports.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {financeHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[26px] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-white/55">{item.label}</p>
                        <p className="mt-2 break-words text-2xl font-semibold leading-tight tracking-tight 2xl:text-[2rem]">
                          {formatTnd(item.value)}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-white/45">{item.note}</p>
                      </div>
                      <div className={`shrink-0 rounded-2xl p-3 ${item.tone}`}>
                        <Icon className="size-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <OwnerAccessPanel
          title="Acces proprietaire"
          description="Verrouillez ou gardez ouvert l'acces aux chiffres sensibles, aux rapports et aux exports financiers."
          unlocked
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ProfitTrendChart data={monthlyPerformance} />

        <div className="space-y-6">
          <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Lecture rapide proprietaire</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {[
                {
                  label: "Cash apres charges",
                  value: formatTnd(cashLeft),
                  note: "Ce qu'il reste pour piloter sereinement le mois.",
                },
                {
                  label: "Taux de marge nette",
                  value: `${profitRate.toFixed(1)}%`,
                  note: "Utile pour savoir si les charges mangent trop la marge.",
                },
                {
                  label: "A surveiller",
                  value:
                    preset.operatingExpenses > preset.grossProfit
                      ? "Charges trop hautes"
                      : "Niveau sain",
                  note: "Repere rapide pour prendre une decision sans lire tout le tableau.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm text-white/55">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>

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
      </div>

      <DataTable columns={columns} data={expenses} variant="dark" />
    </div>
  );
}
