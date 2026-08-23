import { fetchApi } from "@/lib/api";
import { RadarChart } from "@/components/dashboard/radar-chart";
import { NarrativeCard } from "@/components/dashboard/narrative-card";
import { StatWidget } from "@/components/dashboard/stat-widget";
import { Activity, ShieldAlert, FileText } from "lucide-react";
import { Narrative, VrsScore } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const narratives = await fetchApi<Narrative[]>("/narratives/");
  const vrsScores = await fetchApi<VrsScore[]>("/vrs/");
  
  const clusterNames: Record<string, string> = {
    "CLU-01": "Demographic",
    "CLU-02": "Legal System",
    "CLU-03": "Extremism",
    "CLU-04": "Loyalty",
    "CLU-05": "Cultural",
    "CLU-06": "Statistics",
    "CLU-07": "Victimhood"
  };

  const getVrsColor = (score: number) => {
    if (score < 30) return "#34d399";
    if (score < 60) return "#fbbf24";
    if (score < 80) return "#fb923c";
    return "#f87171";
  };

  const narrativeData = narratives.map(n => {
    const latestScore = vrsScores.find(s => s.narrative_id === n.id);
    const score = latestScore?.score || 0;
    const volume = latestScore?.raw_volume || 0;
    const acceleration = latestScore?.acceleration || 1.0;

    return {
      id: n.id,
      name: n.name,
      cluster: clusterNames[n.cluster_id] || n.cluster_id,
      score,
      volume,
      acceleration,
      fill: getVrsColor(score)
    };
  }).filter(n => n.score > 0).sort((a, b) => b.score - a.score);

  const activeAlerts = narrativeData.filter(n => n.score >= 60).length;
  const criticalAlerts = narrativeData.filter(n => n.score >= 80).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Radar Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Real-time threat monitoring across all taxonomy clusters.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatWidget 
          title="Monitored Narratives" 
          value={narratives.length} 
          icon={<FileText className="h-4 w-4" />} 
        />
        <StatWidget 
          title="Active Watch (VRS > 60)" 
          value={activeAlerts} 
          icon={<Activity className="h-4 w-4 text-orange-400" />} 
        />
        <StatWidget 
          title="Critical Alerts (VRS > 80)" 
          value={criticalAlerts} 
          icon={<ShieldAlert className="h-4 w-4 text-red-400" />} 
        />
      </div>

      {narrativeData.length > 0 ? (
        <>
          <RadarChart data={narrativeData} />
          <div>
            <h2 className="text-lg font-semibold mb-4">Top Threats</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {narrativeData.slice(0, 6).map(n => (
                <NarrativeCard key={n.id} {...n} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-12 text-center text-slate-500">
            No data yet — run the ingestion pipeline to start monitoring narratives.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
