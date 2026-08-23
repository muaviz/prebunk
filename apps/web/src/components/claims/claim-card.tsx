import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";
import { Claim } from "@/types";
import { Badge } from "@/components/ui/badge";

export function ClaimCard({ claim }: { claim: Claim }) {
  const isHighVirality = claim.virality_score > 70;
  
  return (
    <div className="glass-surface flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45">
      <div className="flex justify-between items-start mb-4">
        <Badge variant="secondary" className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider">
          {claim.category}
        </Badge>
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Activity className="h-3 w-3" />
          <span className={isHighVirality ? "text-red-500 font-bold" : ""}>
            {claim.virality_score}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-3 leading-tight line-clamp-2">
        {claim.title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">
        {claim.description}
      </p>
      
      <div className="mt-auto border-t border-border/60 pt-4">
        <Link 
          href={`/claims/${claim.id}`}
          className="text-primary font-medium text-sm flex items-center hover:underline"
        >
          Learn More <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
