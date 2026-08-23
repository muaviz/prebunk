"use client";

import { useState, useEffect } from "react";
import { TrendChart } from "./trend-chart";
import { Narrative } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export function TrendsInteractive({ narratives, chartData, colors }: { narratives: Narrative[], chartData: any[], colors: string[] }) {
  const [selectedRange, setSelectedRange] = useState("7d");
  const [selectedNarratives, setSelectedNarratives] = useState(narratives.slice(0, 5).map(n => n.id));
  const [showForecast, setShowForecast] = useState(false);
  const [mergedData, setMergedData] = useState<any[]>(chartData);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  const toggleNarrative = (id: string) => {
    if (selectedNarratives.includes(id)) {
      setSelectedNarratives(selectedNarratives.filter(n => n !== id));
    } else if (selectedNarratives.length < 5) {
      setSelectedNarratives([...selectedNarratives, id]);
    }
  };

  useEffect(() => {
    if (!showForecast) {
      setMergedData(chartData);
      return;
    }

    let isMounted = true;
    const fetchForecasts = async () => {
      setIsLoadingForecast(true);
      try {
        const promises = selectedNarratives.map(id => fetchApi<any>(`/forecast/${id}`));
        const results = await Promise.all(promises);
        
        if (!isMounted) return;

        // Group forecast points by date
        const forecastMap: Record<string, any> = {};
        
        results.forEach((res, i) => {
          const nid = selectedNarratives[i];
          
          // To make the forecast line connect with the historical line, 
          // add the current historical value to the forecast series at the last historical date.
          if (chartData.length > 0) {
            const lastData = chartData[chartData.length - 1];
            const lastDt = lastData.date;
            if (!forecastMap[lastDt]) forecastMap[lastDt] = { date: lastDt };
            forecastMap[lastDt][`${nid}_forecast`] = lastData[nid] ?? res.current_vrs;
            forecastMap[lastDt][`${nid}_range`] = [lastData[nid] ?? res.current_vrs, lastData[nid] ?? res.current_vrs];
          }

          res.forecast.forEach((pt: any) => {
            const dt = new Date(pt.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit' });
            if (!forecastMap[dt]) forecastMap[dt] = { date: dt };
            forecastMap[dt][`${nid}_forecast`] = pt.predicted_vrs;
            forecastMap[dt][`${nid}_range`] = [pt.lower_bound, pt.upper_bound];
          });
        });

        // Append to existing chart data (simplistic merge)
        const combined = [...chartData];
        const forecastDates = Object.keys(forecastMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        
        for (const fd of forecastDates) {
          const existing = combined.find(c => c.date === fd);
          if (existing) {
            Object.assign(existing, forecastMap[fd]);
          } else {
            combined.push(forecastMap[fd]);
          }
        }
        
        setMergedData(combined);
      } catch (err) {
        console.error("Failed to load forecast", err);
      } finally {
        setIsLoadingForecast(false);
      }
    };
    
    fetchForecasts();
    return () => { isMounted = false; };
  }, [showForecast, selectedNarratives, chartData]);

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
        <div className="flex gap-2 items-center">
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
          <div className="ml-4 flex items-center gap-2">
            <input 
              type="checkbox" 
              id="showForecast" 
              checked={showForecast} 
              onChange={e => setShowForecast(e.target.checked)} 
              className="rounded bg-slate-900 border-slate-700 text-sky-500"
            />
            <label htmlFor="showForecast" className="text-sm text-slate-300 flex items-center gap-2">
              Predict 72h
              {isLoadingForecast && <Loader2 className="w-3 h-3 animate-spin text-sky-500" />}
            </label>
          </div>
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
        <TrendChart data={mergedData} lines={lines} showForecast={showForecast} />
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
