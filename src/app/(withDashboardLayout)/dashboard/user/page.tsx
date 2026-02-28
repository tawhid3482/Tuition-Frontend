import RoleDashboardPage from "@/src/components/Dashboard/RoleDashboardPage";

export default function UserDashboardPage() {
  return (
    <RoleDashboardPage
      requiredRole="USER"
      title="User Dashboard"
      description="Welcome to your user dashboard. You can manage your profile, orders, and activity here."
    />
  );
}
