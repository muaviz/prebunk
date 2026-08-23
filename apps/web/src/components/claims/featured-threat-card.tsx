import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Claim } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FeaturedThreatCard({ claim }: { claim: Claim }) {
  const isHighVirality = claim.virality_score > 70;
  
  return (
    <div className="glass-surface group relative flex flex-col gap-6 overflow-hidden rounded-2xl border-2 border-primary/20 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:flex-row">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase tracking-wider text-[10px] font-bold">
            {claim.category}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className={cn(
              "flex w-2 h-2 rounded-full",
              isHighVirality ? "bg-red-500 animate-pulse" : "bg-orange-400"
            )} />
            <span className={isHighVirality ? "text-red-600" : "text-orange-600"}>
              Virality: {claim.virality_score}/100
            </span>
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          {isHighVirality && <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />}
          {claim.title}
        </h3>
        
        <div className="rounded-xl border-l-4 border-l-primary/50 bg-muted/35 p-4 text-lg italic text-muted-foreground shadow-inner">
          &quot;{claim.claim_text}&quot;
        </div>
      </div>
      
      <div className="flex flex-col justify-end shrink-0 md:w-48 pt-4 md:pt-0">
        <Link 
          href={`/claims/${claim.id}`}
          className={cn(buttonVariants({ size: "lg" }), "w-full group-hover:bg-primary/90")}
        >
          Prepare Yourself <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
