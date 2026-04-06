import { OwnerAccessPanel } from "@/components/admin/owner-access-panel";
import { ReportsDashboard } from "@/components/admin/reports-dashboard";
import { hasOwnerFinanceAccess } from "@/lib/admin/owner-access";

export default async function AdminReportsPage() {
  const hasAccess = await hasOwnerFinanceAccess();

  if (!hasAccess) {
    return (
      <OwnerAccessPanel
        title="Rapports verrouilles"
        description="Le proprietaire doit confirmer son mot de passe avant d'ouvrir les rapports, les comparaisons et les exports PDF."
      />
    );
  }

  return <ReportsDashboard />;
}
