import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminUsersManager from "@/src/components/Dashboard/Admin/AdminUsersManager";

export default function SuperAdminUsersPage() {
  return (
    <AdminDashboardShell
      scope="SUPER_ADMIN"
      title="Users"
      description="Monitor all users across the platform."
    >
      <AdminUsersManager />
    </AdminDashboardShell>
  );
}
