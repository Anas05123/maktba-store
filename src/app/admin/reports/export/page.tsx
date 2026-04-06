import { notFound, redirect } from "next/navigation";

import { getReportSlug, reportingSnapshots } from "@/lib/operations";

export default function AdminReportExportPage() {
  const report = reportingSnapshots[0];

  if (!report) {
    notFound();
  }

  redirect(`/documents/reports/${getReportSlug(report)}`);
}
