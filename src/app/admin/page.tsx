import {
  ChartColumn,
  CircleDollarSign,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";

import { MetricCard } from "@/components/admin/metric-card";
import { RevenueChart } from "@/components/admin/performance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardSummary, lowStockProducts, monthlyPerformance, orders } from "@/lib/demo-data";
import { formatTnd } from "@/lib/format";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
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
