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
    <Card className="bg-card border-border hover:border-border transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-muted-foreground mb-1">{cluster}</div>
            <CardTitle className="text-sm font-medium text-foreground line-clamp-1">{name}</CardTitle>
          </div>
          <VrsBadge score={score} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Vol:</span>
            <span className="text-muted-foreground font-mono">{volume}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Acc:</span>
            <span className="flex items-center">
              {acceleration > 1.2 ? <TrendingUp className="h-3 w-3 text-red-400 mr-1" /> : 
               acceleration < 0.8 ? <TrendingDown className="h-3 w-3 text-emerald-400 mr-1" /> :
               <Minus className="h-3 w-3 text-muted-foreground mr-1" />}
              <span className="font-mono text-muted-foreground">{acceleration.toFixed(2)}x</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
