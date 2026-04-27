import {
  ArrowRight,
  ChartColumn,
  CircleDollarSign,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

import { MetricCard } from "@/components/admin/metric-card";
import { RevenueChart } from "@/components/admin/performance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardSummary, lowStockProducts, monthlyPerformance, orders } from "@/lib/demo-data";
import { formatTnd } from "@/lib/format";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[32px] border-white/10 bg-slate-900 bg-[linear-gradient(135deg,rgba(14,165,233,0.10),rgba(15,23,42,0.96))] text-white shadow-2xl shadow-slate-950/20">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-white/45">Vue d&apos;ensemble</p>
                <h1 className="mt-2 text-3xl font-semibold">Le tableau de bord du jour</h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
                  Suivez les commandes, le stock sensible et les indicateurs de pilotage depuis un seul ecran.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/orders"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
                >
                  Ouvrir les commandes
                </Link>
                <Link
                  href="/admin/products"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Gerer le catalogue
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Urgences",
                  note: `${dashboardSummary.lowStockItems} references a surveiller`,
                },
                {
                  title: "Flux commandes",
                  note: `${dashboardSummary.orders} commandes actives sur la periode`,
                },
                {
                  title: "Lecture rapide",
                  note: "Stock, ventes et owner area accessibles sans quitter le dashboard",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Raccourcis utiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Produits", href: "/admin/products" },
              { label: "Categories", href: "/admin/categories" },
              { label: "Bannieres & promos", href: "/admin/marketing" },
              { label: "Stock", href: "/admin/inventory" },
              { label: "Finance proprietaire", href: "/admin/finance" },
            ].map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
              >
                <span>{item.label}</span>
                <ArrowRight className="size-4 text-primary" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          title="Revenue"
          value={formatTnd(dashboardSummary.revenue)}
          hint="Commandes mensuelles ouvertes et livrees"
          icon={CircleDollarSign}
        />
        <MetricCard
          title="Profit estime"
          value={formatTnd(dashboardSummary.profit)}
          hint="Marge brute avant charges"
          icon={ChartColumn}
        />
        <MetricCard
          title="Commandes"
          value={`${dashboardSummary.orders}`}
          hint="Flux actifs sur la periode"
          icon={ShoppingCart}
        />
        <MetricCard
          title="Alertes stock"
          value={`${dashboardSummary.lowStockItems}`}
          hint="Refs a surveiller aujourd'hui"
          icon={TriangleAlert}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RevenueChart data={monthlyPerformance} />

        <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Produits a surveiller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-white/60">Aucune alerte critique actuellement.</p>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  key={product.sku}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{product.name}</p>
                    <span className="text-sm text-primary">{product.stockOnHand}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">
                    Seuil {product.lowStockThreshold} | Fournisseur {product.supplierName}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Commandes recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              className="grid gap-2 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
            >
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-white/60">{order.customer.companyName}</p>
              </div>
              <p className="text-sm text-white/70">{order.status}</p>
              <p className="font-semibold">{formatTnd(order.total)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
