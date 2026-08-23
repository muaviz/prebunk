import Link from "next/link";
import { Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold tracking-tight text-lg">PREBUNK</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/claims" className="text-muted-foreground hover:text-foreground transition-colors">
            Claims
          </Link>
          <Link href="#extension" className={cn(buttonVariants({ size: "sm" }), "bg-primary text-primary-foreground hover:bg-primary/90")}>
            Get the Extension
          </Link>
        </nav>
      </div>
    </header>
  );
}
