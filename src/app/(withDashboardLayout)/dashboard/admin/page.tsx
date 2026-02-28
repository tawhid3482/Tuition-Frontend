import RoleDashboardPage from "@/src/components/Dashboard/RoleDashboardPage";

export default function AdminDashboardPage() {
  return (
    <RoleDashboardPage
      requiredRole="ADMIN"
      title="Admin Dashboard"
      description="Welcome to the admin dashboard. Monitor platform activity and manage core operations."
    />
  );
}
