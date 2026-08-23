import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText, Calendar, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import { Brief } from "@/types";

export function BriefCard({ brief }: { brief: Brief }) {
  const date = new Date(brief.created_at).toLocaleDateString();
  const isValid = brief.validation_outcome === "passed";

  return (
    <Link href={`/dashboard/briefs/${brief.id}`}>
      <Card className="bg-card border-border hover:border-sky-900/50 hover:bg-muted/50 transition-all cursor-pointer h-full">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="bg-background border-border text-muted-foreground">
              {brief.trigger_type}
            </Badge>
            {brief.vrs_at_generation && (
              <Badge variant="outline" className="bg-background border-sky-900/50 text-primary">
                VRS: {brief.vrs_at_generation.toFixed(1)}
              </Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 flex-1">
            {brief.title.replace("Inoculation Brief: ", "")}
          </h3>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date}
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {brief.language.toUpperCase()}
            </div>
            <div className="flex items-center gap-1 ml-auto">
              {isValid ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              ) : (
                <AlertCircle className="h-3 w-3 text-orange-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
