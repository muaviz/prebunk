import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VrsBadge } from "./vrs-badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface NarrativeCardProps {
  id: string;
  name: string;
  cluster: string;
  score: number;
  acceleration: number;
  volume: number;
}

export function NarrativeCard({ name, cluster, score, acceleration, volume }: NarrativeCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-slate-500 mb-1">{cluster}</div>
            <CardTitle className="text-sm font-medium text-slate-200 line-clamp-1">{name}</CardTitle>
          </div>
          <VrsBadge score={score} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Vol:</span>
            <span className="text-slate-300 font-mono">{volume}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Acc:</span>
            <span className="flex items-center">
              {acceleration > 1.2 ? <TrendingUp className="h-3 w-3 text-red-400 mr-1" /> : 
               acceleration < 0.8 ? <TrendingDown className="h-3 w-3 text-emerald-400 mr-1" /> :
               <Minus className="h-3 w-3 text-slate-500 mr-1" />}
              <span className="font-mono text-slate-300">{acceleration.toFixed(2)}x</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
