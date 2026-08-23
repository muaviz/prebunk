import { ExternalLink, Book, Shield, GraduationCap, FileText, Globe, CheckCircle } from "lucide-react";
import { Refutation } from "@/types";

function getSourceIcon(type: Refutation["source_type"]) {
  switch (type) {
    case "quran":
    case "hadith":
      return <Book className="h-4 w-4" />;
    case "academic":
      return <GraduationCap className="h-4 w-4" />;
    case "islamqa":
      return <Shield className="h-4 w-4" />;
    case "wikipedia":
      return <Globe className="h-4 w-4" />;
    case "factcheck":
      return <CheckCircle className="h-4 w-4" />;
    case "news":
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function getSourceColor(type: Refutation["source_type"]) {
  switch (type) {
    case "quran":
    case "hadith":
    case "islamqa":
      return "bg-emerald-950/40 text-emerald-200 border-emerald-800";
    case "academic":
      return "bg-teal-950/40 text-teal-200 border-teal-800";
    case "wikipedia":
    case "factcheck":
      return "bg-sky-950/40 text-sky-200 border-sky-800";
    case "news":
    default:
      return "bg-slate-800 text-slate-200 border-slate-700";
  }
}

export function RefutationCard({ refutation }: { refutation: Refutation }) {
  const colorClass = getSourceColor(refutation.source_type);
  
  return (
    <div className="glass-surface flex h-full flex-col rounded-2xl p-6">
      <div className="mb-4 bg-red-950/35 text-red-200 p-3 rounded-lg border border-red-900/60 text-sm font-medium">
        <span className="font-bold text-red-300 mr-2">Claim:</span>
        &quot;{refutation.claim}&quot;
      </div>
      
      <p className="text-foreground leading-relaxed flex-1 mb-6">
        {refutation.refutation}
      </p>
      
      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
        <a 
          href={refutation.source_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:brightness-95 ${colorClass}`}
        >
          {getSourceIcon(refutation.source_type)}
          {refutation.source_name}
          <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
        </a>
      </div>
    </div>
  );
}
