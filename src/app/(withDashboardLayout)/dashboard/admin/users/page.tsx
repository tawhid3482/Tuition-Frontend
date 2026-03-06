import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminUsersManager from "@/src/components/Dashboard/Admin/AdminUsersManager";

export default function AdminUsersPage() {
  return (
    <AdminDashboardShell
      scope="ADMIN"
      title="Users"
      description="Monitor all users across the platform."
    >
      <AdminUsersManager />
    </AdminDashboardShell>
  );
}
