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
  const [forecastError, setForecastError] = useState(false);

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
      setForecastError(false);
      return;
    }

    let isMounted = true;
    const fetchForecasts = async () => {
      setIsLoadingForecast(true);
      setForecastError(false);
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
            const fd = new Date(pt.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (!forecastMap[fd]) forecastMap[fd] = { date: fd };
            
            forecastMap[fd][`${nid}_forecast`] = pt.predicted_vrs;
            forecastMap[fd][`${nid}_range`] = [pt.lower_bound, pt.upper_bound];
          });
        });

        // Append forecast points to historical data
        const combined = chartData.map(c => ({...c}));
        
        // Ensure sorted dates if we crossed month/year boundaries properly in a real app
        // Here we just append them in order of the API response
        for (const fd of Object.keys(forecastMap)) {
          // If the date exists in historical, update it
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
        setForecastError(true);
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
                  ? "bg-primary/20 text-primary border border-sky-500/30" 
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {range}
            </button>
          ))}
          <div className="ml-4 flex flex-col">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="showForecast" 
                checked={showForecast} 
                onChange={e => setShowForecast(e.target.checked)} 
                className="rounded bg-card border-border text-primary"
              />
              <label htmlFor="showForecast" className="text-sm text-muted-foreground flex items-center gap-2">
                Show Forecast
                {isLoadingForecast && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
              </label>
            </div>
            {forecastError && <span className="text-xs text-red-500 mt-1">Forecast unavailable. Try again later.</span>}
          </div>
        </div>
        
        <div className="flex overflow-x-auto flex-nowrap md:flex-wrap gap-2 items-center pb-2 md:pb-0">
          <span className="text-sm text-muted-foreground mr-2 whitespace-nowrap">Compare (up to 5):</span>
          {narratives.map(n => (
            <button
              key={n.id}
              onClick={() => toggleNarrative(n.id)}
              disabled={!selectedNarratives.includes(n.id) && selectedNarratives.length >= 5}
              className={`px-2 py-1 text-xs rounded border transition-colors max-w-[150px] truncate ${
                selectedNarratives.includes(n.id)
                  ? "bg-muted border-border text-foreground"
                  : "bg-background border-border text-muted-foreground hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
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
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center text-muted-foreground">
            No historical data yet. Run the ingestion pipeline to generate VRS scores.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
