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
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "academic":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "wikipedia":
    case "factcheck":
      return "bg-sky-100 text-sky-800 border-sky-200";
    case "news":
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

export function RefutationCard({ refutation }: { refutation: Refutation }) {
  const colorClass = getSourceColor(refutation.source_type);
  
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="mb-4 bg-red-50 text-red-900 p-3 rounded-lg border border-red-100 text-sm font-medium">
        <span className="font-bold text-red-700 mr-2">Claim:</span> 
        "{refutation.claim}"
      </div>
      
      <p className="text-foreground leading-relaxed flex-1 mb-6">
        {refutation.refutation}
      </p>
      
      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
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
