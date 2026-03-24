import { notFound } from "next/navigation";

import { InvoiceDocument } from "@/components/documents/invoice-document";
import { getOperationalOrder } from "@/lib/operations";

export default async function AccountInvoicePage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = getOperationalOrder(orderNumber);

  if (!order) {
    notFound();
  }

  return <InvoiceDocument order={order} />;
}
