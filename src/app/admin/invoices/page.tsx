import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTnd } from "@/lib/format";
import { invoiceRegistry, operationalOrders } from "@/lib/operations";

export default function AdminInvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Factures emises", value: `${invoiceRegistry.length}` },
          {
            label: "Factures payees",
            value: `${invoiceRegistry.filter((item) => item.status === "Payee").length}`,
          },
          {
            label: "Montant facture",
            value: formatTnd(invoiceRegistry.reduce((sum, item) => sum + item.total, 0)),
          },
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
        {invoiceRegistry.map((invoice) => {
          const order = operationalOrders.find((item) => item.orderNumber === invoice.orderNumber);

          return (
            <Card key={invoice.invoiceNumber} className="rounded-[28px] border-white/10 bg-white/5 text-white">
              <CardHeader>
                <CardTitle>{invoice.invoiceNumber}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{invoice.customerName}</p>
                  <p className="text-sm text-white/60">
                    {invoice.orderNumber} • {formatDate(invoice.issueDate)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold">{formatTnd(invoice.total)}</p>
                  {order ? (
                    <Link
                      href={`/documents/invoices/${order.orderNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-slate-950"
                    >
                      Ouvrir la facture
                    </Link>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
