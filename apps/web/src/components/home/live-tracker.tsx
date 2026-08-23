import Link from "next/link";
import { Narrative, VrsScore } from "@/types";
import { TrendChart } from "@/components/charts/trend-chart";
import { VrsBadge } from "@/components/ui/vrs-badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface LiveTrackerProps {
  narratives: Narrative[];
  vrsScores: VrsScore[];
  clusters: { id: string; name: string }[];
}

export function LiveTracker({ narratives, vrsScores, clusters }: LiveTrackerProps) {
  if (!vrsScores || vrsScores.length === 0) {
    return (
      <section id="tracker" className="py-24 max-w-5xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Live Threat Tracker</h2>
          <div className="p-8 border border-border rounded-md bg-muted text-muted-foreground">
            No tracking data available yet. Check back soon.
          </div>
        </div>
      </section>
    );
  }

  // 1. Group VRS scores by date
  const groupedByDate: Record<string, any> = {};
  vrsScores.forEach((score) => {
    const dateStr = new Date(score.computed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = { date: dateStr };
    }
    groupedByDate[dateStr][score.narrative_id] = score.score;
  });

  const chartData = Object.values(groupedByDate).reverse();
  if (chartData.length === 1) {
    chartData.unshift({ ...chartData[0], date: 'Prev' });
  }

  // 2. Identify top 5 narratives by their most recent score
  const latestScores = new Map<string, VrsScore>();
  vrsScores.forEach((score) => {
    if (!latestScores.has(score.narrative_id) || new Date(score.computed_at) > new Date(latestScores.get(score.narrative_id)!.computed_at)) {
      latestScores.set(score.narrative_id, score);
    }
  });

  const topScores = Array.from(latestScores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const topNarratives = topScores.map(score => {
    const narrative = narratives.find(n => n.id === score.narrative_id);
    const cluster = clusters.find(c => c.id === narrative?.cluster_id)?.name || narrative?.cluster_id || "Unknown";
    return {
      narrative: narrative!,
      score,
      cluster
    };
  }).filter(item => item.narrative !== undefined);

  const colors = ["#38bdf8", "#818cf8", "#f472b6", "#a3e635", "#fbbf24"];
  const lines = topNarratives.map((item, idx) => ({
    key: item.narrative.id,
    color: colors[idx % colors.length],
    name: item.narrative.name
  }));

  return (
    <section id="tracker" className="py-24 max-w-5xl mx-auto px-6">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground">Live Threat Tracker</h2>
        <p className="text-muted-foreground mt-2">Velocity Risk Scores for the top narratives over the past 7 days.</p>
      </div>

      <div className="mb-12">
        <TrendChart data={chartData} lines={lines} showForecast={false} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topNarratives.map(({ narrative, score, cluster }) => (
          <Link key={narrative.id} href={`/taxonomy/${narrative.id}`}>
            <div className="p-5 rounded-md border border-border bg-card hover:border-primary/50 transition-colors h-full flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-muted-foreground">{cluster}</div>
                <VrsBadge score={score.score} />
              </div>
              <h3 className="font-semibold text-sm line-clamp-2 mb-4 flex-1">{narrative.name}</h3>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                  <span>Vol:</span>
                  <span className="font-mono">{score.raw_volume}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Acc:</span>
                  <span className="flex items-center">
                    {score.acceleration > 1.2 ? <TrendingUp className="h-3 w-3 text-destructive mr-1" /> : 
                     score.acceleration < 0.8 ? <TrendingDown className="h-3 w-3 text-emerald-600 mr-1" /> :
                     <Minus className="h-3 w-3 mr-1" />}
                    <span className="font-mono">{score.acceleration.toFixed(2)}x</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
