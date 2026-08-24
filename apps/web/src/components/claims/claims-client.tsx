"use client";

import { useState } from "react";
import { Claim } from "@/types";
import { ClaimCard } from "@/components/claims/claim-card";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Input } from "@/components/ui/input";

export function ClaimsClient({ claims }: { claims: Claim[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const sortedCategories = Array.from(new Set(claims.map((c) => c.category))).sort();
  const categories = ["All", ...sortedCategories];

  const filteredClaims = claims.filter((claim) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      claim.title.toLowerCase().includes(q) || 
      claim.description.toLowerCase().includes(q) ||
      claim.claim_text.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === "All" || claim.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <ScrollReveal delay={100} className="mb-10 glass-surface p-4 rounded-xl flex flex-col sm:flex-row gap-4 border border-border/50">
        <Input 
          type="text" 
          placeholder="Search claims or dog whistles..." 
          className="h-11 sm:h-10 bg-secondary/20 border-border/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select 
          className="flex h-11 sm:h-10 w-full sm:w-[200px] items-center justify-between rounded-md border border-border/50 bg-secondary/20 px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-background text-foreground">{c === "All" ? "All Categories" : c}</option>
          ))}
        </select>
      </ScrollReveal>

      {filteredClaims.length === 0 ? (
        <div className="glass-surface rounded-2xl py-20 text-center border border-border/50">
          <p className="text-muted-foreground">No claims match your search criteria.</p>
          <button 
            onClick={() => { setSearchQuery(""); setCategoryFilter("All"); }}
            className="mt-4 text-primary text-sm hover:underline py-3 inline-block"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClaims.map((claim, index) => (
            <ScrollReveal key={claim.id} delay={index * 60}>
              <ClaimCard claim={claim} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </>
  );
}
