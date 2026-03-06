import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminCatalogManager from "@/src/components/Dashboard/Admin/AdminCatalogManager";

export default function SuperAdminCatalogPage() {
  return (
    <AdminDashboardShell
      scope="SUPER_ADMIN"
      title="Catalog Tools"
      description="Update categories/products and soft-delete products."
    >
      <AdminCatalogManager />
    </AdminDashboardShell>
  );
}
