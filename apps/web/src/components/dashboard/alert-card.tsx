import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShieldAlert, Clock, Users } from "lucide-react";

export function AlertCard({ alert }: { alert: any }) {
  const date = new Date(alert.created_at).toLocaleString();
  const isRed = alert.alert_level === "red";
  
  const colorClass = isRed ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-orange-400 border-orange-500/30 bg-orange-500/10";
  const iconColor = isRed ? "text-red-400" : "text-orange-400";

  return (
    <Card className="bg-card border-border hover:border-border transition-colors">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${colorClass}`}>
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={colorClass}>
                  {alert.alert_level.toUpperCase()}
                </Badge>
                <span className="text-sm font-mono text-muted-foreground">VRS: {alert.vrs_score.toFixed(1)}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{alert.narrative_name}</h3>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {date}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {alert.subscribers_notified} notified
            </div>
          </div>
        </div>
        
        {alert.brief_id && (
          <div className="mt-4 pt-4 border-t border-border flex justify-end">
            <Link href={`/dashboard/briefs/${alert.brief_id}`} className="text-sm text-primary hover:underline">
              View Associated Brief &rarr;
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
