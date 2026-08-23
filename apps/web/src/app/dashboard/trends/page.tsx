import { fetchApi } from "@/lib/api";
import { TrendsInteractive } from "@/components/dashboard/trends-interactive";
import { Narrative, VrsScore } from "@/types";

export default async function TrendsPage() {
  const narratives = await fetchApi<Narrative[]>("/narratives/");
  const vrsScores = await fetchApi<VrsScore[]>("/vrs/");

  const scoredNarrativeIds = new Set(vrsScores.map(s => s.narrative_id));
  const activeNarratives = narratives.filter(n => scoredNarrativeIds.has(n.id));

  const colors = ["#38bdf8", "#818cf8", "#f472b6", "#a3e635", "#fbbf24"];

  // Group VRS scores by date
  const groupedByDate: Record<string, any> = {};
  
  vrsScores.forEach(score => {
    // Just use the date part for grouping
    const dateStr = new Date(score.computed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = { date: dateStr };
    }
    groupedByDate[dateStr][score.narrative_id] = score.score;
  });

  // Convert to array and sort by actual date (assuming they are recent)
  // For simplicity since it's already sorted from DB or we can sort keys
  const chartData = Object.values(groupedByDate).reverse();
  // Ensure we have at least 2 points for a line to render, even if flat
  if (chartData.length === 1) {
    const fakePastPoint = { ...chartData[0], date: 'Prev' };
    chartData.unshift(fakePastPoint);
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
