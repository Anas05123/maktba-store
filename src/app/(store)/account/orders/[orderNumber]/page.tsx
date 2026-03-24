import Link from "next/link";
import { notFound } from "next/navigation";

import { AccountNav } from "@/components/account/account-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTnd } from "@/lib/format";
import { formatOperationalTimeline, getOperationalOrder } from "@/lib/operations";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = getOperationalOrder(orderNumber);

  if (!order) {
    notFound();
  }

  const timeline = formatOperationalTimeline(order.timeline);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Suivi commande
          </p>
          <h1 className="mt-2 text-4xl font-semibold">{order.orderNumber}</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Commande passee le {formatDate(order.placedAt)} pour {order.customerName}.
          </p>
        </div>
        <AccountNav />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="rounded-[32px] border-white/70 bg-white/90">
            <CardHeader>
              <CardTitle>Articles commandes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.sku} className="flex items-center justify-between rounded-3xl border p-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Qt {item.quantity}</p>
                    <p className="font-semibold">{formatTnd(item.total)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-white/70 bg-white/90">
            <CardHeader>
              <CardTitle>Chronologie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeline.map((entry) => (
                <div key={`${entry.label}-${entry.at}`} className="rounded-3xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{entry.label}</p>
                    <span className="text-sm text-muted-foreground">{entry.displayDate}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{entry.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-white/70 bg-white/90">
            <CardHeader>
              <CardTitle>Statuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Commande", value: order.orderStatus },
                { label: "Preparation", value: order.fulfillmentStatus },
                { label: "Packaging", value: order.packagingStatus },
                { label: "Livraison", value: order.deliveryStatus },
                { label: "Paiement", value: order.paymentStatus },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <Badge variant="secondary" className="rounded-full">
                    {item.value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-white/70 bg-white/90">
            <CardHeader>
              <CardTitle>Livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><span className="text-muted-foreground">Transporteur:</span> {order.delivery.courier}</p>
              <p><span className="text-muted-foreground">Tracking:</span> {order.delivery.trackingNumber}</p>
              <p><span className="text-muted-foreground">Date estimee:</span> {formatDate(order.delivery.estimatedDeliveryDate)}</p>
              <p><span className="text-muted-foreground">Adresse:</span> {order.shippingAddress}, {order.shippingCity}</p>
              <Link
                href={`/account/orders/${order.orderNumber}/invoice`}
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                Telecharger la facture
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-white/70 bg-white/90">
            <CardHeader>
              <CardTitle>Montants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Sous-total</span>
                <span>{formatTnd(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Livraison</span>
                <span>{formatTnd(order.shippingCost)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatTnd(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
