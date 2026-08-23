"use client";

import { useState } from "react";
import { Narrative } from "@/types";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function TipSubmissionForm({ userId, narratives }: { userId: string, narratives: Narrative[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return;
    
    setLoading(true);
    try {
      await fetchApi("/tips/", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          description: formData.description,
          source_url: null,
          platform: null,
          related_narrative_id: null
        })
      });
      setFormData({ description: "" });
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to submit tip.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">What did you observe?</label>
        <Textarea 
          placeholder="Describe the narrative, source, and context..." 
          required
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          className="bg-background border-border text-foreground min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">Include any URLs, platform names, or related narratives directly in your description.</p>
      </div>

      <Button 
        type="submit" 
        disabled={loading || !formData.description.trim()} 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
      >
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : "Submit Tip"}
      </Button>
    </form>
  );
}
