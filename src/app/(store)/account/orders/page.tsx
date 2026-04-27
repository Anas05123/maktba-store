import Link from "next/link";

import { AccountNav } from "@/components/account/account-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserOrders } from "@/lib/account-data";
import { formatDate, formatTnd } from "@/lib/format";

export default async function AccountOrdersPage() {
  const orders = await getCurrentUserOrders();

  return (
    <div className="w-full space-y-8 px-4 py-10 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Espace client
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Historique des commandes</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
            Suivez vos commandes, controlez leur progression logistique et retrouvez vos factures a tout moment.
          </p>
        </div>
        <AccountNav />
      </div>

      <Card className="rounded-[32px] border-white/70 bg-white/90">
        <CardHeader>
          <CardTitle>Mes commandes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length ? (
            orders.map((order) => (
              <div key={order.orderNumber} className="rounded-3xl border p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.placedAt)} • {order.itemsCount} article(s)
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Livraison: {order.deliveryStatusLabel} • Paiement: {order.paymentStatusLabel}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {order.items.map((item) => item.name).slice(0, 3).join(" • ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="rounded-full">
                      {order.statusLabel}
                    </Badge>
                    <p className="font-semibold">{formatTnd(order.total)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-border px-4 text-sm font-medium"
                  >
                    Voir le detail
                  </Link>
                  <Link
                    href={`/documents/invoices/${order.orderNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
                  >
                    Facture PDF
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
              Vous n&apos;avez aucune commande pour le moment.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
