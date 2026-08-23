import { fetchApi } from "@/lib/api";
import { Brief } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { BriefContentDisplay } from "@/components/brief/brief-content-display";
import { CopyResponseButton } from "@/components/briefs/copy-response-button";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const brief = await fetchApi<Brief>(`/briefs/${resolvedParams.id}`);
    return {
      title: `${brief.title} | Prebunk`,
      description: brief.content.summary?.substring(0, 160) || "Inoculation brief against anti-Muslim misinformation.",
    };
  } catch (e) {
    return {
      title: "Brief Not Found | Prebunk",
    };
  }
}

export default async function BriefDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let brief: Brief | null = null;
  try {
    brief = await fetchApi<Brief>(`/briefs/${resolvedParams.id}`);
  } catch (error) {
    notFound();
  }
  
  if (!brief) {
    notFound();
  }

  const isValid = brief.validation_outcome === "passed";
  const date = new Date(brief.created_at).toLocaleDateString();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 px-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/briefs" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Archive
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{brief.title.replace("Inoculation Brief: ", "")}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Badge variant="outline" className="bg-muted border-border text-muted-foreground">
                  {date}
                </Badge>
                <Badge variant="outline" className="bg-muted border-border text-muted-foreground">
                  {brief.trigger_type}
                </Badge>
                {brief.vrs_at_generation !== null && brief.vrs_at_generation !== undefined && (
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                    VRS: {brief.vrs_at_generation.toFixed(1)}
                  </Badge>
                )}
                <Badge variant="outline" className={`bg-muted border-border ${isValid ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {isValid ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                  {isValid ? "Validated" : "Flagged"}
                </Badge>
              </div>
            </div>
            
            <div className="shrink-0 mt-2 md:mt-0">
              {brief.content.personal_script && (
                <CopyResponseButton personalScript={brief.content.personal_script} />
              )}
            </div>
          </div>

          <div className="pt-4">
            <BriefContentDisplay brief={brief} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
