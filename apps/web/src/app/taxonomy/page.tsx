import { fetchApi } from "@/lib/api";
import { Narrative } from "@/types";
import { TaxonomyList } from "@/components/taxonomy/taxonomy-list";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function TaxonomyBrowserPage() {
  const narratives = await fetchApi<Narrative[]>("/narratives/");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-sky-400" />
            <Link href="/" className="font-bold tracking-tight text-lg">PREBUNK</Link>
            <span className="text-slate-600 mx-2">/</span>
            <span className="text-slate-300">Taxonomy Browser</span>
          </div>
          <Link href="/dashboard" className="text-sm text-sky-400 hover:underline">
            Dashboard
          </Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Narrative Taxonomy</h1>
          <p className="text-slate-400 max-w-3xl">
            An open-source encyclopedia of known anti-Muslim rhetoric, structural conspiracy theories, 
            and manipulative tropes. Use this browser to identify and understand coordinated campaigns.
          </p>
        </div>
        
        <TaxonomyList narratives={narratives} />
      </main>
    </div>
  );
}
