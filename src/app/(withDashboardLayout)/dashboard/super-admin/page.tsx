import RoleDashboardPage from "@/src/components/Dashboard/RoleDashboardPage";

export default function SuperAdminDashboardPage() {
  return (
    <RoleDashboardPage
      requiredRole="SUPER_ADMIN"
      title="Super Admin Dashboard"
      description="Welcome to the super admin dashboard. Configure system-level settings and global administration."
    />
  );
}
