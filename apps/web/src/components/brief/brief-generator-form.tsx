"use client";

import { useState } from "react";
import { Narrative, NarrativeMatch, Brief } from "@/types";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefContentDisplay } from "./brief-content-display";
import { Search, Loader2, FileText, CheckCircle } from "lucide-react";

export function BriefGeneratorForm({ narratives, initialNarrativeId }: { narratives: Narrative[], initialNarrativeId?: string }) {
  const [text, setText] = useState("");
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState<NarrativeMatch[] | null>(null);
  
  const [selectedNarrativeId, setSelectedNarrativeId] = useState<string | null>(initialNarrativeId || null);
  const [generating, setGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<Brief | null>(null);

  const handleMatch = async () => {
    if (!text.trim()) return;
    setMatching(true);
    setMatches(null);
    setGeneratedBrief(null);
    try {
      const result = await fetchApi<NarrativeMatch[]>("/briefs/match", {
        method: "POST",
        body: JSON.stringify({ text, threshold: 0.3 })
      });
      setMatches(result);
      if (result.length > 0) {
        setSelectedNarrativeId(result[0].narrative_id);
      } else {
        setSelectedNarrativeId(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to analyze text.");
    } finally {
      setMatching(false);
    }
  };

  const handleGenerate = async (narrativeId: string) => {
    setGenerating(true);
    setGeneratedBrief(null);
    try {
      const brief = await fetchApi<Brief>("/briefs/generate", {
        method: "POST",
        body: JSON.stringify({ narrative_id: narrativeId, trigger_type: "on_demand" })
      });
      setGeneratedBrief(brief);
    } catch (err) {
      console.error(err);
      alert("Failed to generate brief. This can take up to 30 seconds.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl">1. Analyze Content</CardTitle>
          <p className="text-sm text-muted-foreground">Paste a suspicious article, post, or message to detect underlying narratives.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Paste text here..." 
            value={text}
            onChange={e => setText(e.target.value)}
            className="min-h-[150px] bg-background border-border text-foreground"
          />
          <div className="flex justify-between items-center">
            <select 
              value={selectedNarrativeId || ""}
              onChange={e => {
                setSelectedNarrativeId(e.target.value);
                setMatches(null);
              }}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm text-muted-foreground w-full max-w-xs"
            >
              <option value="">Or select a narrative manually...</option>
              {narratives.map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
            
            <Button 
              onClick={handleMatch} 
              disabled={matching || !text.trim()} 
              className="bg-muted hover:bg-slate-700 text-primary-foreground"
            >
              {matching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Analyze Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {matches !== null && (
        <Card className="bg-card border-border border-l-4 border-l-sky-500">
          <CardHeader>
            <CardTitle className="text-xl">2. Detection Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.map(match => (
                  <div 
                    key={match.narrative_id} 
                    onClick={() => setSelectedNarrativeId(match.narrative_id)}
                    className={`p-4 rounded-md border cursor-pointer transition-colors flex items-center justify-between ${
                      selectedNarrativeId === match.narrative_id 
                        ? 'bg-primary/10 border-sky-500/30' 
                        : 'bg-background border-border hover:bg-muted'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {selectedNarrativeId === match.narrative_id && <CheckCircle className="h-4 w-4 text-primary" />}
                        {match.narrative_name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Confidence: {(match.similarity_score * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground p-4 bg-background rounded border border-border">
                No known narratives detected with high confidence in the provided text.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedNarrativeId && (
        <div className="flex justify-center pt-4">
          <Button 
            size="lg" 
            onClick={() => handleGenerate(selectedNarrativeId)}
            disabled={generating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full max-w-md shadow-lg shadow-sky-500/20"
          >
            {generating ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Generating Inoculation Brief (this takes a moment)...</>
            ) : (
              <><FileText className="h-5 w-5 mr-2" /> Generate Inoculation Brief</>
            )}
          </Button>
        </div>
      )}

      {generatedBrief && (
        <div className="border-t border-border pt-8 mt-8">
          <h2 className="text-2xl font-bold mb-2">Generated Brief</h2>
          <p className="text-muted-foreground mb-6">This brief has been saved to the archive.</p>
          <BriefContentDisplay brief={generatedBrief} />
        </div>
      )}
    </div>
  );
}
