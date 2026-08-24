"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

export function DemoPlayground() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    
    try {
      const data = await fetchApi<any>("/extension/analyze", {
        method: "POST",
        body: JSON.stringify({ text, threshold: 0.55 }),
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze text.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="demo" className="bg-secondary/5 py-24 border-y border-border/40">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Try the Prebunk API</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Test our narrative detection engine directly from your browser. Paste a suspicious claim below to see how our system categorizes it and provides refutation points.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100} className="glass-surface p-6 rounded-2xl border border-border/50">
          <div className="flex flex-col space-y-4">
            <Textarea 
              placeholder="Paste text here (e.g., 'They are trying to impose Sharia law in our cities...')"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] bg-background/50 text-base md:text-sm"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !text.trim()} 
              className="w-full sm:w-auto self-end min-h-[44px]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Text"
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-border/40 pb-2">
                Analysis Results
              </h3>
              
              {!result.matched ? (
                <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-600 mb-1">No Claims Detected</h4>
                    <p className="text-sm text-emerald-600/80">Our engine didn't detect any known anti-Muslim tropes in this text.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-5 rounded-xl border border-primary/20 bg-primary/5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                      <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        {result.claim.title}
                      </h4>
                      {result.is_llm_generated ? (
                        <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-bold whitespace-nowrap">
                          AI Fallback Detected
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-primary text-white text-xs font-bold whitespace-nowrap">
                          {Math.round(result.claim.similarity_score * 100)}% Match Confidence
                        </span>
                      )}
                    </div>
                    
                    {result.is_llm_generated && (
                      <div className="mb-4 text-xs bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg text-orange-600">
                        <strong>⚠️ AI-Generated Analysis:</strong> This result was generated by an LLM because no exact match was found in the database. Please verify with trusted sources.
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-3 italic">
                      {result.claim.description}
                    </p>
                  </div>

                  {result.prebunk?.personal_script && (
                    <div className="bg-background rounded-xl p-5 border border-border/60">
                      <h5 className="font-semibold text-sm mb-3">Suggested Response Script</h5>
                      <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                        "{result.prebunk.personal_script}"
                      </p>
                    </div>
                  )}

                  {result.prebunk?.talking_points && result.prebunk.talking_points.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-sm mb-3">Factual Talking Points</h5>
                      <ul className="space-y-2">
                        {result.prebunk.talking_points.map((point: string, i: number) => (
                          <li key={i} className="flex gap-3 text-sm text-muted-foreground bg-background p-3 rounded-lg border border-border/40">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!result.is_llm_generated && result.prebunk?.refutations && result.prebunk.refutations.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-sm mb-3">Evidence & Sources</h5>
                      <div className="flex flex-col gap-2">
                        {result.prebunk.refutations.map((ref: any, i: number) => (
                          ref.source_url ? (
                            <a key={i} href={ref.source_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline p-3 bg-background rounded-lg border border-border/40 inline-flex items-center justify-between">
                              <span>{ref.source_name}</span>
                              <span className="text-xs text-muted-foreground ml-2">&rarr;</span>
                            </a>
                          ) : (
                            <div key={i} className="text-sm p-3 bg-background rounded-lg border border-border/40 inline-flex items-center justify-between">
                              <span>{ref.source_name}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
