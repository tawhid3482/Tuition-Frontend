import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminCatalogManager from "@/src/components/Dashboard/Admin/AdminCatalogManager";

export default function AdminCatalogPage() {
  return (
    <AdminDashboardShell
      scope="ADMIN"
      title="Catalog Tools"
      description="Update categories/products and soft-delete products."
    >
      <AdminCatalogManager />
    </AdminDashboardShell>
  );
}
