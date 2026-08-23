"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function BriefActions({ briefId }: { briefId: string }) {
  const [copying, setCopying] = useState(false);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    setCopying(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    // In Phase 8, this will trigger the real generation API
    setTimeout(() => {
      setGenerating(false);
      alert("Brief regeneration triggered! This will be fully functional in Phase 8.");
    }, 1000);
  };

  const handlePublish = () => {
    alert("Publish flow will be implemented in Phase 8.");
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        onClick={handleGenerate}
        disabled={generating}
        className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${generating ? "animate-spin" : ""}`} /> 
        {generating ? "Generating..." : "Generate New Version"}
      </Button>
      <Button 
        variant="outline" 
        onClick={handleCopy}
        className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
      >
        <Copy className="h-4 w-4 mr-2" /> 
        {copying ? "Copied!" : "Copy Link"}
      </Button>
      <Button onClick={handlePublish} className="bg-sky-500 hover:bg-sky-600 text-white">
        <Share2 className="h-4 w-4 mr-2" /> Publish
      </Button>
    </div>
  );
}
