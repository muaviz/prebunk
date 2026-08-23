import { fetchApi } from "@/lib/api";
import { AlertCard } from "@/components/dashboard/alert-card";

export default async function AlertsPage() {
  const alerts = await fetchApi<any[]>("/alerts/");
  
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alert Log</h1>
        <p className="text-sm text-slate-400 mt-1">Chronological record of high-velocity narrative alerts.</p>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        {alerts.length === 0 && (
          <div className="text-center p-12 bg-slate-900 border border-slate-800 rounded-md text-slate-500">
            No active alerts recorded.
          </div>
        )}
      </div>
    </div>
  );
}
