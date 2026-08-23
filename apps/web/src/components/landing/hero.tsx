import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LiquidParticles } from "@/components/landing/liquid-particles";

export function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100svh-1rem)] overflow-hidden pt-28 pb-24 md:pt-36 md:pb-28">
      <LiquidParticles />
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.025]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-b from-transparent via-background/70 to-muted/50" />
      
      <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-background/75 px-3 py-1 text-sm text-primary shadow-sm backdrop-blur-sm animate-fade-in-up">
          <ShieldCheck className="h-4 w-4 mr-2" />
          <span className="font-medium">Predictive Threat Intelligence</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 max-w-4xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          Prebunk the next viral threat before it spreads.
        </h1>
        
        <p className="mb-12 max-w-2xl text-xl leading-relaxed text-muted-foreground animate-fade-in-up md:text-2xl" style={{animationDelay: '0.2s'}}>
          We track emerging anti-Muslim narratives to predict what&apos;s about to go mainstream. Arm yourself with factual refutations before the hate hits your feed.
        </p>
        
        <div className="flex flex-col gap-4 animate-fade-in-up sm:flex-row" style={{animationDelay: '0.3s'}}>
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
