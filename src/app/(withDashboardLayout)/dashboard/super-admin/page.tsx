import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminOverview from "@/src/components/Dashboard/Admin/AdminOverview";

export default function SuperAdminDashboardPage() {
  return (
    <AdminDashboardShell
      scope="SUPER_ADMIN"
      title="Super Admin Dashboard"
      description="Global administration with web settings and full platform control."
    >
      <AdminOverview scope="SUPER_ADMIN" />
    </AdminDashboardShell>
  );
}
