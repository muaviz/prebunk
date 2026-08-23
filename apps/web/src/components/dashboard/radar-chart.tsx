"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BubbleData {
  id: string;
  name: string;
  cluster: string;
  score: number;
  volume: number;
  fill: string;
}

export function RadarChart({ data }: { data: BubbleData[] }) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded-md shadow-xl max-w-xs">
          <div className="text-xs text-muted-foreground mb-1">{data.cluster}</div>
          <div className="text-sm font-semibold text-foreground mb-2">{data.name}</div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">VRS Score:</span>
            <span className="font-mono text-foreground">{data.score.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-mono text-foreground">{data.volume}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Narrative Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full" role="img" aria-label="Radar chart displaying narrative volume versus VRS score">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis 
                type="category" 
                dataKey="cluster" 
                name="Cluster" 
                stroke="#64748b" 
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis 
                type="number" 
                dataKey="score" 
                name="VRS Score" 
                domain={[0, 100]} 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <ZAxis type="number" dataKey="volume" range={[60, 400]} name="Volume" />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Narratives" data={data}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
