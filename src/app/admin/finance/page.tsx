import { FinanceDashboard } from "@/components/admin/finance-dashboard";
import { OwnerAccessPanel } from "@/components/admin/owner-access-panel";
import { hasOwnerFinanceAccess } from "@/lib/admin/owner-access";

export default async function AdminFinancePage() {
  const hasAccess = await hasOwnerFinanceAccess();

  if (!hasAccess) {
    return (
      <OwnerAccessPanel
        title="Finance verrouillee"
        description="Avant d'ouvrir le chiffre d'affaires, la marge ou les charges, le proprietaire doit entrer son mot de passe secret."
      />
    );
  }

  return <FinanceDashboard />;
}
