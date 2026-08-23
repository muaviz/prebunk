"use client";

import { useState } from "react";
import { Narrative } from "@/types";
import { TaxonomyCard } from "./taxonomy-card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TaxonomyList({ narratives }: { narratives: Narrative[] }) {
  const [search, setSearch] = useState("");
  const [cluster, setCluster] = useState("all");
  const [technique, setTechnique] = useState("all");

  const clusters = Array.from(new Set(narratives.map(n => n.cluster_id))).sort();
  const techniques = Array.from(new Set(narratives.map(n => n.technique_id))).sort();

  const filtered = narratives.filter(n => {
    const matchesSearch = n.name.toLowerCase().includes(search.toLowerCase()) || 
                          n.description.toLowerCase().includes(search.toLowerCase());
    const matchesCluster = cluster === "all" || n.cluster_id === cluster;
    const matchesTechnique = technique === "all" || n.technique_id === technique;
    
    return matchesSearch && matchesCluster && matchesTechnique;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input 
            type="text" 
            placeholder="Search narratives..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-800 text-slate-100"
          />
        </div>
        <select 
          value={cluster} 
          onChange={(e) => setCluster(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-300"
        >
          <option value="all">All Clusters</option>
          {clusters.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
          value={technique} 
          onChange={(e) => setTechnique(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-300 capitalize"
        >
          <option value="all">All Techniques</option>
          {techniques.map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(n => (
          <TaxonomyCard key={n.id} narrative={n} />
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No narratives found matching your filters.
        </div>
      )}
    </div>
  );
}
