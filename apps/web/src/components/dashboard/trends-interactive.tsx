"use client";

import { useState } from "react";
import { TrendChart } from "./trend-chart";
import { Narrative } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export function TrendsInteractive({ narratives, chartData, colors }: { narratives: Narrative[], chartData: any[], colors: string[] }) {
  const [selectedRange, setSelectedRange] = useState("7d");
  const [selectedNarratives, setSelectedNarratives] = useState(narratives.slice(0, 5).map(n => n.id));

  const toggleNarrative = (id: string) => {
    if (selectedNarratives.includes(id)) {
      setSelectedNarratives(selectedNarratives.filter(n => n !== id));
    } else if (selectedNarratives.length < 5) {
      setSelectedNarratives([...selectedNarratives, id]);
    }
  };

  const lines = narratives
    .filter(n => selectedNarratives.includes(n.id))
    .map((n, i) => ({
      key: n.id,
      name: n.name,
      color: colors[i % colors.length]
    }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          {["7d", "30d", "All Time"].map(range => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedRange === range 
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" 
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-500 mr-2">Compare (up to 5):</span>
          {narratives.map(n => (
            <button
              key={n.id}
              onClick={() => toggleNarrative(n.id)}
              disabled={!selectedNarratives.includes(n.id) && selectedNarratives.length >= 5}
              className={`px-2 py-1 text-xs rounded border transition-colors max-w-[150px] truncate ${
                selectedNarratives.includes(n.id)
                  ? "bg-slate-800 border-slate-600 text-slate-200"
                  : "bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              title={n.name}
            >
              {n.name}
            </button>
          ))}
        </div>
      </div>

      {chartData.length > 0 ? (
        <TrendChart data={chartData} lines={lines} />
      ) : (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-12 text-center text-slate-500">
            No historical data yet. Run the ingestion pipeline to generate VRS scores.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
