import { Puzzle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function ExtensionPromo() {
  return (
    <section id="extension" className="relative isolate flex min-h-0 py-16 lg:min-h-[calc(100svh-1rem)] lg:py-24 w-full items-center overflow-hidden bg-transparent px-6 lg:px-10">
      <ScrollReveal className="relative z-10 w-full lg:-translate-x-10">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
          <div className="flex w-full justify-center">
            <div className="relative flex h-72 w-full max-w-md flex-col overflow-hidden rounded-xl border border-border/80 bg-card/60 shadow-lg md:h-[21rem]">
            <div className="bg-muted p-2 flex items-center gap-2 border-b border-border">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-4 relative h-full">
              <p className="text-sm bg-emerald-950/40 text-emerald-200 inline-block p-1 rounded italic mb-4 blur-[1px]">
                 &quot;Eurabia is inevitable unless we remove kebab from our continent...&quot;
              </p>
              
              <div className="absolute right-4 top-10 w-56 sm:right-8 sm:top-12 sm:w-64 bg-card border border-border rounded-md shadow-lg z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-3 border-b border-border flex items-center gap-2">
                   <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">P</div>
                   <span className="font-semibold text-xs">Prebunk Analysis</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-xs font-semibold text-white bg-accent inline-block px-2 py-0.5 rounded">AI Detected</div>
                  <p className="text-sm font-bold">White Supremacist Tropes</p>
                  <p className="text-xs text-muted-foreground">&quot;Eurabia&quot; is a conspiracy theory about demographic takeover. &quot;Remove kebab&quot; is a violent meme referencing the ethnic cleansing of Bosnian Muslims...</p>
                  <div className="h-2 bg-muted rounded w-full mt-2"></div>
                  <div className="h-2 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
            </div>
          </div>
          <a href="#" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "self-center rounded-full border-primary/35 bg-primary/10 px-5 min-h-[44px] sm:min-h-0 text-foreground shadow-[0_0_20px_rgba(63,128,93,0.12)] hover:border-primary/60 hover:bg-primary/20 pointer-events-none opacity-80")}>
            <Puzzle className="mr-2 h-4 w-4" />
            Chrome Extension (Coming Soon)
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
