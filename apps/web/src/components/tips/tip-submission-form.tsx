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
    source_url: "",
    platform: "",
    related_narrative_id: ""
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
          source_url: formData.source_url || null,
          platform: formData.platform || null,
          related_narrative_id: formData.related_narrative_id || null
        })
      });
      setFormData({ description: "", source_url: "", platform: "", related_narrative_id: "" });
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
        <label className="text-sm font-medium text-slate-200">What did you observe?</label>
        <Textarea 
          placeholder="Describe the narrative, source, and context..." 
          required
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          className="bg-slate-950 border-slate-800 text-slate-200 min-h-[100px]"
        />
        <p className="text-xs text-slate-500">Include any URLs, platform names, or related narratives directly in your description.</p>
      </div>

      <Button 
        type="submit" 
        disabled={loading || !formData.description.trim()} 
        className="w-full bg-sky-500 hover:bg-sky-600 text-white mt-2"
      >
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : "Submit Tip"}
      </Button>
    </form>
  );
}
