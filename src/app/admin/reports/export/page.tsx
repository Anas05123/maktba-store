import { notFound } from "next/navigation";

import { FinancialReportDocument } from "@/components/documents/financial-report-document";
import { reportingSnapshots } from "@/lib/operations";

export default function AdminReportExportPage() {
  const report = reportingSnapshots[0];

  if (!report) {
    notFound();
  }

  return <FinancialReportDocument report={report} />;
}
