import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminProductsManager from "@/src/components/Dashboard/Admin/AdminProductsManager";

export default function SuperAdminProductsPage() {
  return (
    <AdminDashboardShell
      scope="SUPER_ADMIN"
      title="All Products"
      description="View all products and manage update, status, and delete actions from one route."
    >
      <AdminProductsManager addProductHref="/dashboard/super-admin/products/add" />
    </AdminDashboardShell>
  );
}
