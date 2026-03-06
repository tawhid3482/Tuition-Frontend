import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminNotificationsManager from "@/src/components/Dashboard/Admin/AdminNotificationsManager";

export default function AdminNotificationsPage() {
  return (
    <AdminDashboardShell
      scope="ADMIN"
      title="Send Notifications"
      description="Push updates to All, USER, or ADMIN audience."
    >
      <AdminNotificationsManager />
    </AdminDashboardShell>
  );
}
