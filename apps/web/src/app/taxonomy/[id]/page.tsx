import { fetchApi } from "@/lib/api";
import { Narrative } from "@/types";
import Link from "next/link";
import { Shield, ArrowLeft, ExternalLink, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const narrative = await fetchApi<Narrative>(`/narratives/${resolvedParams.id}`);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20">
      <header className="border-b border-slate-900 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/taxonomy" className="flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Taxonomy
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-sky-400" />
            <span className="font-bold tracking-tight">PREBUNK</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-8">
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge variant="outline" className="bg-slate-900 border-slate-700 text-slate-300">
                {narrative.cluster_id}
              </Badge>
              <Badge variant="outline" className="bg-sky-500/10 border-sky-500/20 text-sky-400 capitalize">
                {narrative.technique_id.replace("_", " ")}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{narrative.name}</h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
              {narrative.description}
            </p>
          </div>
          
          <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
            <Link 
              href={`/dashboard/generate?narrative=${narrative.id}`}
              className={cn(buttonVariants({ size: "lg" }), "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 w-full")}
            >
              <Zap className="h-4 w-4 mr-2" /> Generate Brief
            </Link>
            <p className="text-xs text-slate-500 text-center">Requires dashboard access</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 border-t border-slate-900 pt-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Historical Origin</h2>
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-slate-300 leading-relaxed text-sm">
                {narrative.historical_origin || "No historical origin documented."}
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Propagation Path</h2>
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-slate-300 leading-relaxed text-sm">
                {narrative.propagation_path || "No propagation path documented."}
              </div>
            </section>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Factual Refutations</h2>
              <div className="space-y-3">
                {narrative.factual_refutations ? narrative.factual_refutations.map((ref, idx) => (
                  <div key={idx} className="bg-emerald-950/20 rounded-lg p-4 border border-emerald-900/30">
                    <p className="font-medium text-emerald-100 mb-1">Claim: {ref.claim}</p>
                    <p className="text-emerald-200/80 text-sm mb-2">{ref.refutation}</p>
                    <p className="text-emerald-500/80 text-xs italic">Source: {ref.source}</p>
                  </div>
                )) : (
                  <p className="text-slate-500 text-sm">No refutations documented.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Inoculation Hook</h2>
              <div className="bg-sky-950/20 rounded-xl p-6 border border-sky-900/50 text-sky-200 leading-relaxed text-sm italic border-l-4 border-l-sky-500">
                "{narrative.inoculation_hook || "No inoculation hook documented."}"
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Talking Points</h2>
              <ul className="space-y-3 list-decimal list-inside text-slate-300 text-sm bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                {narrative.talking_points?.map((tp, idx) => (
                  <li key={idx}>{tp}</li>
                )) || <li>No talking points documented.</li>}
              </ul>
            </section>

            {narrative.related_narrative_ids && narrative.related_narrative_ids.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 text-slate-200">Related Narratives</h2>
                <div className="flex flex-col gap-2">
                  {narrative.related_narrative_ids.map((id, idx) => (
                    <Link key={idx} href={`/taxonomy/${id}`} className="text-sky-400 hover:underline text-sm flex items-center gap-2">
                      <ExternalLink className="h-3 w-3" /> {id}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Variants & Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {narrative.variants ? narrative.variants.map((v, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-normal">
                    {v}
                  </Badge>
                )) : (
                  <p className="text-slate-500 text-sm">No variants documented.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
