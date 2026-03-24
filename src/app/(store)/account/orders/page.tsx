import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orders } from "@/lib/demo-data";
import { formatDate, formatTnd } from "@/lib/format";

export default function AccountOrdersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Order history
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Historique des commandes</h1>
      </div>

      <Card className="rounded-[32px] border-white/70 bg-white/90">
        <CardHeader>
          <CardTitle>Commandes recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderNumber} className="rounded-3xl border p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.companyName} • {formatDate(order.placedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="rounded-full">
                    {order.status}
                  </Badge>
                  <p className="font-semibold">{formatTnd(order.total)}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
