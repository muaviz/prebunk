import { fetchApi } from "@/lib/api";
import { TrendsInteractive } from "@/components/dashboard/trends-interactive";
import { Narrative, VrsScore } from "@/types";

export default async function TrendsPage() {
  const narratives = await fetchApi<Narrative[]>("/narratives/");
  const vrsScores = await fetchApi<VrsScore[]>("/vrs/");

  const scoredNarrativeIds = new Set(vrsScores.map(s => s.narrative_id));
  const activeNarratives = narratives.filter(n => scoredNarrativeIds.has(n.id));

  const colors = ["#38bdf8", "#818cf8", "#f472b6", "#a3e635", "#fbbf24"];

  const chartData: any[] = [];
  
  if (vrsScores.length > 0) {
      const latestDate = new Date(vrsScores[0].computed_at).toLocaleDateString();
      const point: any = { date: latestDate };
      activeNarratives.forEach(n => {
          const score = vrsScores.find(s => s.narrative_id === n.id)?.score || 0;
          point[n.id] = score;
      });
      chartData.push(point);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trends</h1>
        <p className="text-sm text-slate-400 mt-1">Historical velocity comparison for top narratives.</p>
      </div>

      <TrendsInteractive 
        narratives={activeNarratives} 
        chartData={chartData} 
        colors={colors} 
      />
    </div>
  );
}
