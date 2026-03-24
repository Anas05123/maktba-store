import { DocumentActions } from "@/components/documents/document-actions";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatTnd } from "@/lib/format";
import type { OperationalOrder } from "@/lib/operations";

export function InvoiceDocument({ order, showActions = true }: { order: OperationalOrder; showActions?: boolean }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
      {showActions ? <DocumentActions /> : null}

      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm print:shadow-none">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Facture</p>
            <h1 className="mt-2 text-3xl font-semibold">{order.invoice.invoiceNumber}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Liee a la commande {order.orderNumber} du {formatDate(order.invoice.issueDate)}
            </p>
          </div>
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-white/60">Maktba Store</p>
            <p className="mt-2 text-2xl font-semibold">Papeterie & fournitures</p>
            <p className="mt-3 text-sm text-white/70">
              Tunis, Sfax, Sousse et livraison partout en Tunisie.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-600">Client</p>
            <p className="mt-3 text-lg font-semibold">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-600">Livraison</p>
            <p className="mt-3 text-lg font-semibold">{order.receiverName}</p>
            <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingCity}, {order.shippingGovernorate}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 font-medium">Article</th>
                <th className="px-5 py-4 font-medium">SKU</th>
                <th className="px-5 py-4 font-medium">Qt</th>
                <th className="px-5 py-4 font-medium">Prix</th>
                <th className="px-5 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.sku} className="border-t border-slate-200">
                  <td className="px-5 py-4">{item.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.sku}</td>
                  <td className="px-5 py-4">{item.quantity}</td>
                  <td className="px-5 py-4">{formatTnd(item.unitPrice)}</td>
                  <td className="px-5 py-4 text-right font-medium">{formatTnd(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-600">Paiement et suivi</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>Methode: {order.paymentMethod}</p>
              <p>Statut paiement: {order.paymentStatus}</p>
              <p>Statut commande: {order.orderStatus}</p>
              <p>Statut livraison: {order.deliveryStatus}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="flex items-center justify-between text-sm">
              <span>Sous-total</span>
              <span>{formatTnd(order.subtotal)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span>Livraison</span>
              <span>{formatTnd(order.shippingCost)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span>Taxes</span>
              <span>{formatTnd(order.taxAmount)}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatTnd(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
