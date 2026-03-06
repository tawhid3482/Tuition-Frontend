import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminPromoCodesManager from "@/src/components/Dashboard/Admin/AdminPromoCodesManager";

export default function SuperAdminPromoCodesPage() {
  return (
    <AdminDashboardShell
      scope="SUPER_ADMIN"
      title="Promo Codes"
      description="Create, update, and remove promo campaigns."
    >
      <AdminPromoCodesManager />
    </AdminDashboardShell>
  );
}
