import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminOverview from "@/src/components/Dashboard/Admin/AdminOverview";

export default function AdminDashboardPage() {
  return (
    <AdminDashboardShell
      scope="ADMIN"
      title="Admin Dashboard"
      description="Operations, orders, users, contacts, promo codes and catalog control in one place."
    >
      <AdminOverview scope="ADMIN" />
    </AdminDashboardShell>
  );
}
