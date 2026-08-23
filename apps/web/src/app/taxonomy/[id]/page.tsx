import { fetchApi } from "@/lib/api";
import { Narrative, Brief } from "@/types";
import Link from "next/link";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const narratives = await fetchApi<Narrative[]>("/narratives/");
    return narratives.map((narrative) => ({
      id: narrative.id,
    }));
  } catch (error) {
    console.error("Failed to fetch narratives for static params", error);
    return [];
  }
}

export default async function NarrativeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let narrative: Narrative | null = null;
  try {
    narrative = await fetchApi<Narrative>(`/narratives/${resolvedParams.id}`);
  } catch (error) {
    notFound();
  }
  
  if (!narrative) {
    notFound();
  }

  
  // Find if there's a brief for this narrative
  const allBriefs = await fetchApi<Brief[]>("/briefs/").catch(() => []);
  const recentBrief = allBriefs.find(b => b.narrative_id === narrative.id && b.validation_outcome === "passed");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
      <SiteHeader />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <Link href="/taxonomy" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Taxonomy
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-8">
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge variant="outline" className="bg-card border-border text-muted-foreground">
                {narrative.cluster_id}
              </Badge>
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary capitalize">
                {narrative.technique_id.replace("_", " ")}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{narrative.name}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {narrative.description}
            </p>
          </div>
          
          {recentBrief && (
            <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <Link 
                href={`/briefs/${recentBrief.id}`}
                className={cn(buttonVariants({ size: "lg" }), "bg-primary hover:bg-primary/90 text-primary-foreground w-full")}
              >
                <BookOpen className="h-4 w-4 mr-2" /> Read the Prebunk
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 border-t border-border pt-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Historical Origin</h2>
              <div className="bg-muted rounded-xl p-6 border border-border text-muted-foreground leading-relaxed text-sm">
                {narrative.historical_origin || "No historical origin documented."}
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Propagation Path</h2>
              <div className="bg-muted rounded-xl p-6 border border-border text-muted-foreground leading-relaxed text-sm">
                {narrative.propagation_path || "No propagation path documented."}
              </div>
            </section>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Factual Refutations</h2>
              <div className="space-y-3">
                {narrative.factual_refutations ? narrative.factual_refutations.map((ref, idx) => (
                  <div key={idx} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <p className="font-medium text-emerald-900 mb-1">Claim: {ref.claim}</p>
                    <p className="text-emerald-700 text-sm mb-2">{ref.refutation}</p>
                    <p className="text-emerald-600 text-xs italic">Source: {ref.source}</p>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-sm">No refutations documented.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Inoculation Hook</h2>
              <div className="bg-sky-50 rounded-xl p-6 border border-sky-200 text-sky-900 leading-relaxed text-sm italic border-l-4 border-l-primary">
                "{narrative.inoculation_hook || "No inoculation hook documented."}"
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Talking Points</h2>
              <ul className="space-y-3 list-decimal list-inside text-muted-foreground text-sm bg-muted p-6 rounded-xl border border-border">
                {narrative.talking_points?.map((tp, idx) => (
                  <li key={idx}>{tp}</li>
                )) || <li>No talking points documented.</li>}
              </ul>
            </section>

            {narrative.related_narrative_ids && narrative.related_narrative_ids.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Related Narratives</h2>
                <div className="flex flex-col gap-2">
                  {narrative.related_narrative_ids.map((id, idx) => (
                    <Link key={idx} href={`/taxonomy/${id}`} className="text-primary hover:underline text-sm flex items-center gap-2">
                      <ExternalLink className="h-3 w-3" /> {id}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Variants & Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {narrative.variants ? narrative.variants.map((v, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-muted hover:bg-muted text-muted-foreground font-normal border border-border">
                    {v}
                  </Badge>
                )) : (
                  <p className="text-muted-foreground text-sm">No variants documented.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
