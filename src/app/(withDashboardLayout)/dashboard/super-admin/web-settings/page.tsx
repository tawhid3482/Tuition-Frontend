import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import SuperAdminWebSettingsManager from "@/src/components/Dashboard/Admin/SuperAdminWebSettingsManager";

export default function SuperAdminWebSettingsPage() {
  return (
    <AdminDashboardShell
      scope="SUPER_ADMIN"
      title="Web Settings"
      description="Manage global website theme, button states and tracking IDs."
    >
      <SuperAdminWebSettingsManager />
    </AdminDashboardShell>
  );
}
