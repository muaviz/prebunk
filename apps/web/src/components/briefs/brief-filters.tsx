"use client";

import { useState } from "react";
import { BriefCard } from "./brief-card";
import { Brief } from "@/types";

export function BriefArchiveInteractive({ briefs }: { briefs: Brief[] }) {
  const [filterType, setFilterType] = useState<string>("all");
  
  const filteredBriefs = briefs.filter(brief => {
    if (filterType === "all") return true;
    return brief.trigger_type === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6">
        {["all", "on_demand", "scheduled", "alert"].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 text-sm rounded-md transition-colors capitalize ${
              filterType === type 
                ? "bg-primary/20 text-primary border border-primary/30" 
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {type.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBriefs.map(brief => (
          <BriefCard key={brief.id} brief={brief} />
        ))}
        {filteredBriefs.length === 0 && (
          <div className="col-span-3 text-center p-12 bg-card border border-border rounded-md text-muted-foreground">
            No briefs match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
