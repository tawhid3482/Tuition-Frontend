import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminProductsManager from "@/src/components/Dashboard/Admin/AdminProductsManager";

export default function AdminProductsPage() {
  return (
    <AdminDashboardShell
      scope="ADMIN"
      title="All Products"
      description="View all products and manage update, status, and delete actions from one route."
    >
      <AdminProductsManager addProductHref="/dashboard/admin/products/add" />
    </AdminDashboardShell>
  );
}
