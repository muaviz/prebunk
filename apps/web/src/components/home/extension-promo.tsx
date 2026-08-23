import { Puzzle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExtensionPromo() {
  return (
    <section id="extension" className="py-24 max-w-5xl mx-auto px-6 bg-background">
      <div className="flex flex-col md:flex-row items-center gap-12 p-8 border border-border rounded-xl bg-muted/30">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Puzzle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Prebunk Anywhere</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Highlight suspicious text on any webpage and instantly analyze it against our tracking taxonomy. Get fact-based talking points right when you need them.
          </p>
          <div className="pt-4">
            <a href="https://github.com/yourusername/prebunk" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "lg" }), "bg-primary hover:bg-primary/90 text-primary-foreground")}>
              Download Chrome Extension
            </a>
            <p className="text-xs text-muted-foreground mt-3">Currently available as an unpacked developer extension.</p>
          </div>
        </div>
        
        <div className="flex-1 w-full flex justify-center">
          <div className="w-full max-w-sm border border-border bg-card rounded-lg shadow-sm overflow-hidden flex flex-col h-80 relative">
            <div className="bg-muted p-2 flex items-center gap-2 border-b border-border">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-4 relative h-full">
              <p className="text-sm bg-blue-50 text-blue-900 inline-block p-1 rounded italic mb-4 blur-[1px]">
                 "They're secretly replacing the population..."
              </p>
              
              <div className="absolute right-8 top-12 w-64 bg-card border border-border rounded-md shadow-lg z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-3 border-b border-border flex items-center gap-2">
                   <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">P</div>
                   <span className="font-semibold text-xs">Prebunk</span>
                </div>
                <div className="p-3">
                   <div className="text-xs font-semibold mb-1 text-primary">The Great Replacement (82% Match)</div>
                   <p className="text-[10px] text-muted-foreground italic mb-2">"When someone says this, the reality is..."</p>
                   <div className="w-full h-6 bg-muted rounded flex items-center justify-center text-[10px] font-medium border border-border">Copy Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
