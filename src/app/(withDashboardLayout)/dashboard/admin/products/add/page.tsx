import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminAddProductManager from "@/src/components/Dashboard/Admin/AdminAddProductManager";

export default function AdminAddProductPage() {
  return (
    <AdminDashboardShell
      scope="ADMIN"
      title="Add Product"
      description="Create a new product from a dedicated route."
    >
      <AdminAddProductManager backHref="/dashboard/admin/products" />
    </AdminDashboardShell>
  );
}
