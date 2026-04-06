import { notFound, redirect } from "next/navigation";

import { FinancialReportDocument } from "@/components/documents/financial-report-document";
import { hasOwnerFinanceAccess } from "@/lib/admin/owner-access";
import { getReportingSnapshotBySlug } from "@/lib/operations";

export default async function DocumentReportPage({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  const hasAccess = await hasOwnerFinanceAccess();
  const report = getReportingSnapshotBySlug(period);

  if (!hasAccess) {
    redirect("/admin/reports");
  }

  if (!report) {
    notFound();
  }

  return <FinancialReportDocument report={report} />;
}
