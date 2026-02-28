import RoleDashboardPage from "@/src/components/Dashboard/RoleDashboardPage";

export default function ManagerDashboardPage() {
  return (
    <RoleDashboardPage
      requiredRole="MANAGER"
      title="Manager Dashboard"
      description="Welcome to the manager dashboard. Track team performance and coordinate daily workflows."
    />
  );
}
