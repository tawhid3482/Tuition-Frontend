import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminCategoriesManager from "@/src/components/Dashboard/Admin/AdminCategoriesManager";

export default function AdminCategoriesPage() {
  return (
    <AdminDashboardShell
      scope="ADMIN"
      title="Category Management"
      description="Manage all categories separately with create, update, status, and delete controls."
    >
      <AdminCategoriesManager />
    </AdminDashboardShell>
  );
}
