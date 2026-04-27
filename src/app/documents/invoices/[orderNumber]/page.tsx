import { notFound } from "next/navigation";

import { InvoiceDocument } from "@/components/documents/invoice-document";
import { getAccessibleOrderByNumber, mapOrderToInvoiceDocument } from "@/lib/account-data";

export default async function DocumentInvoicePage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getAccessibleOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  return <InvoiceDocument order={mapOrderToInvoiceDocument(order)} />;
}
