"use client";

import { Line, Area } from "recharts";

export function ForecastOverlay({ narrativeId, color }: { narrativeId: string; color: string }) {
  // We return the Recharts components to be injected into a ComposedChart
  return (
    <>
      <Area 
        type="monotone" 
        dataKey={`${narrativeId}_range`} 
        fill={color} 
        stroke="none" 
        fillOpacity={0.15} 
        isAnimationActive={false}
      />
      <Line
        type="monotone"
        dataKey={`${narrativeId}_forecast`}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5 5"
        dot={false}
        isAnimationActive={false}
      />
    </>
  );
}
