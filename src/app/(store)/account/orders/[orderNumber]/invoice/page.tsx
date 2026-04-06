import { redirect } from "next/navigation";

export default async function AccountInvoicePage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  redirect(`/documents/invoices/${orderNumber}`);
}
