import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100svh-1rem)] overflow-hidden pb-24 pt-28 sm:pt-36 lg:pt-[clamp(9rem,28vh,16rem)] md:pb-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-b from-transparent via-background/70 to-background" />
      
      <div className="relative z-20 mx-auto flex w-full max-w-[44rem] flex-col items-start px-6 text-left lg:translate-x-10 lg:px-10">
        <h1 className="mt-6 mb-8 max-w-4xl font-display text-5xl font-bold leading-tight tracking-[-0.035em] text-foreground animate-fade-in-up sm:text-6xl md:text-[5.5rem] md:leading-[1.05]" style={{animationDelay: '0.1s'}}>
          Debunk a false claim <span className="text-yellow-500">before</span> it goes viral
        </h1>
        
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground animate-fade-in-up sm:text-xl md:text-2xl" style={{animationDelay: '0.2s'}}>
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
