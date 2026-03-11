import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminAddProductManager from "@/src/components/Dashboard/Admin/AdminAddProductManager";

export default function SuperAdminAddProductPage() {
  return (
    <AdminDashboardShell
      scope="SUPER_ADMIN"
      title="Add Product"
      description="Create a new product from a dedicated route."
    >
      <AdminAddProductManager backHref="/dashboard/super-admin/products" />
    </AdminDashboardShell>
  );
}
