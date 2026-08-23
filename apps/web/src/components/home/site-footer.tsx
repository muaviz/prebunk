import Link from "next/link";
import { Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">PREBUNK</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Built for the 2026 Harvest Anti-Muslim Hate Hackathon.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link href="/briefs" className="text-muted-foreground hover:text-foreground">Briefs</Link>
          <Link href="/taxonomy" className="text-muted-foreground hover:text-foreground">Taxonomy</Link>
          <Link href="#extension" className="text-muted-foreground hover:text-foreground">Extension</Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Prebunk Initiative. All rights reserved.
      </div>
    </footer>
  );
}
