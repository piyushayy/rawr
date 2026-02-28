import { getAnalyticsData } from "./analytics-actions";
import AdminDashboardClient from "./AdminDashboard";

export default async function AdminDashboardPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-heading font-black uppercase">
        Command Center
      </h2>
      <AdminDashboardClient data={data} />
    </div>
  );
}
