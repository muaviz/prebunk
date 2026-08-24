import Link from "next/link";
import { IslamicLogo } from "@/components/ui/islamic-logo";

export function SiteFooter() {
  return (
    <footer className="bg-background py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 text-foreground">
            <IslamicLogo className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">PREBUNK</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Built for the 2026 Harvest Anti-Muslim Hate Hackathon.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
          <Link href="/claims" className="text-muted-foreground hover:text-foreground py-2 inline-block">Claims</Link>
          <Link href="#extension" className="text-muted-foreground hover:text-foreground py-2 inline-block">Extension</Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground py-2 inline-block">Privacy Policy</Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Prebunk Initiative. All rights reserved.
      </div>
    </footer>
  );
}
