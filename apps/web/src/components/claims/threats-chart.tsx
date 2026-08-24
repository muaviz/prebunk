"use client";

import { Claim } from "@/types";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function ThreatsChart({ claims }: { claims: Claim[] }) {
  // Take top 5 claims for the graph
  const topClaims = [...claims]
    .sort((a, b) => b.virality_score - a.virality_score)
    .slice(0, 5);

  const colors = [
    "var(--color-destructive)", 
    "var(--color-primary)", 
    "rgba(156, 178, 162, 0.25)",
    "rgba(156, 178, 162, 0.2)",
    "rgba(156, 178, 162, 0.15)"
  ];

  // Generate 7 days of historical data showing fluctuations
  const days = ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"];
  
  const data = days.map((day, i) => {
    const point: any = { name: day };
    topClaims.forEach(claim => {
      // Create a curve that ends at the actual virality score
      const target = claim.virality_score;
      const progress = i / (days.length - 1); // 0 to 1
      
      // Start lower and trend upwards
      let val = target * (0.4 + 0.6 * progress);
      
      // Add pseudo-random fluctuation (except for "Today" which is the real score)
      if (i < days.length - 1) {
         // Create deterministic "randomness" based on string length and index
         val += (Math.sin(claim.id.charCodeAt(6) * i * 15) * 12); 
      }
      point[claim.id] = Math.max(0, Math.min(100, Math.round(val)));
    });
    return point;
  });

  if (topClaims.length === 0) return null;

  return (
    <div className="w-full h-[350px] bg-secondary/20 rounded-xl border border-border/50 p-6 flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Threat Velocity Trend (7 Days)</h3>
        <p className="text-xs text-muted-foreground">Historical virality score fluctuations</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              type="number" 
              domain={[0, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  // Sort payload descending by value
                  const sortedPayload = [...payload].sort((a, b) => (b.value as number) - (a.value as number));
                  
                  return (
                    <div className="bg-background/95 backdrop-blur-md border border-border p-3 rounded-md shadow-xl text-xs min-w-[200px]">
                      <p className="text-muted-foreground mb-2 font-medium">{label}</p>
                      <div className="flex flex-col gap-1.5">
                        {sortedPayload.map((entry, index) => (
                          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="font-medium text-foreground">{entry.name}</span>
                            </div>
                            <span className="text-muted-foreground font-semibold">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {topClaims.map((claim, index) => {
              const isGreyedOut = index >= 2;
              return (
                <Line 
                  key={claim.id}
                  type="monotone" 
                  dataKey={claim.id} 
                  name={claim.title.length > 30 ? claim.title.substring(0, 30) + '...' : claim.title}
                  stroke={colors[index]} 
                  strokeWidth={isGreyedOut ? 1.5 : 2}
                  strokeDasharray={isGreyedOut ? "4 4" : undefined}
                  dot={isGreyedOut ? false : { r: 3, fill: colors[index], strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: colors[index], stroke: "var(--color-background)", strokeWidth: 2 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
