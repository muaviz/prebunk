import { fetchApi } from "@/lib/api";
import { Brief } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { BriefActions } from "@/components/dashboard/brief-actions";
import { BriefContentDisplay } from "@/components/brief/brief-content-display";
import Link from "next/link";

export default async function BriefDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const brief = await fetchApi<Brief>(`/briefs/${resolvedParams.id}`);
  
  const isValid = brief.validation_outcome === "passed";
  const date = new Date(brief.created_at).toLocaleDateString();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <Link href="/dashboard/briefs" className="hover:text-slate-200 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Archive
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{brief.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <Badge variant="outline" className="bg-slate-900 border-slate-700 text-slate-300">
              {date}
            </Badge>
            <Badge variant="outline" className="bg-slate-900 border-slate-700 text-slate-300">
              {brief.trigger_type}
            </Badge>
            {brief.vrs_at_generation !== null && brief.vrs_at_generation !== undefined && (
              <Badge variant="outline" className="bg-slate-900 border-sky-900/50 text-sky-400">
                VRS: {brief.vrs_at_generation.toFixed(1)}
              </Badge>
            )}
            <Badge variant="outline" className={`bg-slate-900 border-slate-700 ${isValid ? 'text-emerald-400' : 'text-orange-400'}`}>
              {isValid ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
              {isValid ? "Validated" : "Flagged"}
            </Badge>
          </div>
        </div>
        <BriefActions briefId={brief.id} />
      </div>

      <BriefContentDisplay brief={brief} />
    </div>
  );
}