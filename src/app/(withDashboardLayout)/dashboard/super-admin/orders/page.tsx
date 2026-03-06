import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminOrdersManager from "@/src/components/Orders/AdminOrdersManager";

export default function SuperAdminOrdersPage() {
  return (
    <AdminDashboardShell
      scope="SUPER_ADMIN"
      title="Order Management"
      description="Monitor every order across the platform and manage delivery states."
    >
      <AdminOrdersManager
        title="Super Admin Orders"
        description="Monitor every order across the platform and manage delivery states."
      />
    </AdminDashboardShell>
  );
}
