import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminOrdersManager from "@/src/components/Orders/AdminOrdersManager";

export default function AdminOrdersPage() {
  return (
    <AdminDashboardShell
      scope="ADMIN"
      title="Order Management"
      description="View all user orders and update order statuses."
    >
      <AdminOrdersManager
        title="Admin Orders"
        description="View all user orders and update order statuses."
      />
    </AdminDashboardShell>
  );
}
