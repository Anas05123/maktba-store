import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { deliveryBoard, operationalOrders } from "@/lib/operations";

export default function AdminDeliveriesPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Livraisons actives",
            value: `${deliveryBoard.filter((item) => item.deliveryStatus !== "Livree").length}`,
          },
          {
            label: "Colis livres",
            value: `${deliveryBoard.filter((item) => item.deliveryStatus === "Livree").length}`,
          },
          {
            label: "En transit",
            value: `${deliveryBoard.filter((item) => item.deliveryStatus === "En transit").length}`,
          },
          { label: "Trackings", value: `${deliveryBoard.length}` },
        ].map((item) => (
          <Card key={item.label} className="rounded-[28px] border-white/10 bg-white/5 text-white">
            <CardContent className="p-6">
              <p className="text-sm text-white/60">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {deliveryBoard.map((delivery) => {
          const order = operationalOrders.find((item) => item.orderNumber === delivery.orderNumber)!;

          return (
            <Card key={delivery.trackingNumber} className="rounded-[28px] border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>{delivery.orderNumber}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-sm text-white/50">Client</p>
                    <p className="mt-1 font-semibold">{delivery.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Tracking</p>
                    <p className="mt-1 font-semibold">{delivery.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Transporteur</p>
                    <p className="mt-1 font-semibold">{delivery.courier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">ETA</p>
                    <p className="mt-1 font-semibold">{formatDate(delivery.estimatedDeliveryDate)}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white/70">Historique livraison</p>
                  <div className="mt-3 space-y-3">
                    {order.delivery.attempts.map((attempt) => (
                      <div key={`${attempt.status}-${attempt.at}`} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span>{attempt.status}</span>
                        <span className="text-white/60">{formatDate(attempt.at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
