import AdminDashboardShell from "@/src/components/Dashboard/Admin/AdminDashboardShell";
import AdminContactsManager from "@/src/components/Dashboard/Admin/AdminContactsManager";

export default function SuperAdminContactsPage() {
  return (
    <AdminDashboardShell
      scope="SUPER_ADMIN"
      title="Contact Messages"
      description="Review all support and contact form messages."
    >
      <AdminContactsManager />
    </AdminDashboardShell>
  );
}
