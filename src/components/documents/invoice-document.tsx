import { DocumentActions } from "@/components/documents/document-actions";
import { Separator } from "@/components/ui/separator";
import type { InvoiceDocumentOrder } from "@/lib/account-data";
import { formatDate, formatTnd } from "@/lib/format";

export function InvoiceDocument({
  order,
  showActions = true,
}: {
  order: InvoiceDocumentOrder;
  showActions?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6 print:max-w-none print:px-0 print:py-0">
      {showActions ? <DocumentActions /> : null}

      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_22px_55px_rgba(15,23,42,0.08)] print:rounded-none print:border-0 print:px-8 print:py-6 print:shadow-none">
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Maktba Store</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Facture client
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Papeterie, fournitures scolaires et livraison partout en Tunisie.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm sm:min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Facture</span>
              <span className="font-semibold text-slate-950">{order.invoice.invoiceNumber}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-slate-500">Commande</span>
              <span className="font-medium text-slate-950">{order.orderNumber}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-slate-500">Date</span>
              <span className="font-medium text-slate-950">{formatDate(order.invoice.issueDate)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-slate-500">Paiement</span>
              <span className="font-medium text-slate-950">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b border-slate-200 py-6 sm:grid-cols-2">
          <div className="rounded-[22px] bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Facture a</p>
            <p className="mt-3 text-base font-semibold text-slate-950">{order.customerName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{order.customerEmail}</p>
            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
          </div>

          <div className="rounded-[22px] bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Livrer a</p>
            <p className="mt-3 text-base font-semibold text-slate-950">{order.receiverName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{order.shippingAddress}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingCity}, {order.shippingGovernorate}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Article</th>
                <th className="px-4 py-3 font-medium">Qt</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 text-right font-medium">Montant</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.sku} className="border-t border-slate-200">
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-950">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.sku}</p>
                  </td>
                  <td className="px-4 py-4">{item.quantity}</td>
                  <td className="px-4 py-4">{formatTnd(item.unitPrice)}</td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-950">
                    {formatTnd(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_280px]">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-700">Informations de suivi</p>
            <div className="mt-3 space-y-2 text-muted-foreground">
              <p>Statut commande: {order.orderStatus}</p>
              <p>Statut paiement: {order.paymentStatus}</p>
              <p>Transporteur: {order.delivery.courier}</p>
              <p>Suivi livraison: {order.delivery.trackingNumber}</p>
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Sous-total</span>
              <span className="font-medium text-slate-950">{formatTnd(order.subtotal)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Livraison</span>
              <span className="font-medium text-slate-950">{formatTnd(order.shippingCost)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Taxes</span>
              <span className="font-medium text-slate-950">{formatTnd(order.taxAmount)}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-slate-950">Net a payer</span>
              <span className="text-slate-950">{formatTnd(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
          Merci pour votre commande. Cette facture est generee depuis votre espace client et reste propre a imprimer ou a exporter en PDF.
        </div>
      </div>
    </div>
  );
}
