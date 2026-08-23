import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-[-1]" />
      
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-8 animate-fade-in-up">
          <ShieldCheck className="h-4 w-4 mr-2" />
          <span className="font-medium">Predictive Threat Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 max-w-4xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          Prebunk the next viral threat before it spreads.
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          We track emerging anti-Muslim narratives to predict what's about to go mainstream. Arm yourself with factual refutations before the hate hits your feed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <Link 
            href="#featured" 
            className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg font-medium")}
          >
            See Emerging Threats <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            href="/claims" 
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-lg font-medium")}
          >
            Browse Known Tropes
          </Link>
        </div>
      </div>
    </section>
  );
}
