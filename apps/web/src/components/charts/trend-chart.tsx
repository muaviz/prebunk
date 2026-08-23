"use client";

import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendChartProps {
  data: any[];
  lines: { key: string; color: string; name: string }[];
  showForecast?: boolean;
}

export function TrendChart({ data, lines, showForecast }: TrendChartProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Velocity & Reach Score Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full" role="img" aria-label="Line chart displaying VRS score trends over time">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              
              <ReferenceLine y={30} stroke="#34d399" strokeDasharray="3 3" opacity={0.5} label={{ position: 'insideTopLeft', value: 'Watch', fill: '#34d399', fontSize: 10 }} />
              <ReferenceLine y={60} stroke="#fb923c" strokeDasharray="3 3" opacity={0.5} label={{ position: 'insideTopLeft', value: 'Alert', fill: '#fb923c', fontSize: 10 }} />
              <ReferenceLine y={80} stroke="#f87171" strokeDasharray="3 3" opacity={0.5} label={{ position: 'insideTopLeft', value: 'Critical', fill: '#f87171', fontSize: 10 }} />
              
              <Tooltip 
                contentStyle={{ backgroundColor: "#ffffff", borderColor: "#E5E5E0", color: "#1A1A1A" }}
                itemStyle={{ color: "#1A1A1A" }}
                formatter={(value: any, name: any) => {
                  const nameStr = String(name || '');
                  if (nameStr.endsWith('_range')) return null;
                  if (nameStr.endsWith('_forecast')) return [`${Number(value).toFixed(1)} (Predicted)`, nameStr.replace('_forecast', '')];
                  return [Number(value).toFixed(1), nameStr];
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              
              {lines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: line.color, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
