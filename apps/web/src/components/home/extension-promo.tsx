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
          <h2 className="text-3xl font-bold text-foreground">Intercept viral hate in real-time.</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Don't get caught off guard by a new talking point. Highlight any suspicious text online, and our extension will instantly tell you if it's an emerging threat—and give you the exact facts to prebunk it.
          </p>
          <div className="pt-4">
            <a href="https://github.com/muaviz/prebunk" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ size: "lg" }), "bg-primary hover:bg-primary/90 text-primary-foreground")}>
              Install Chrome Extension
            </a>
            <p className="text-xs text-muted-foreground mt-3">Available on GitHub as an unpacked developer extension.</p>
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
              <p className="text-sm bg-emerald-50 text-emerald-900 inline-block p-1 rounded italic mb-4 blur-[1px]">
                 "Eurabia is inevitable unless we remove kebab from our continent..."
              </p>
              
              <div className="absolute right-8 top-12 w-64 bg-card border border-border rounded-md shadow-lg z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-3 border-b border-border flex items-center gap-2">
                   <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">P</div>
                   <span className="font-semibold text-xs">Prebunk Analysis</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-xs font-semibold text-white bg-accent inline-block px-2 py-0.5 rounded">AI Detected</div>
                  <p className="text-sm font-bold">White Supremacist Tropes</p>
                  <p className="text-xs text-muted-foreground">"Eurabia" is a conspiracy theory about demographic takeover. "Remove kebab" is a violent meme referencing the ethnic cleansing of Bosnian Muslims...</p>
                  <div className="h-2 bg-muted rounded w-full mt-2"></div>
                  <div className="h-2 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
