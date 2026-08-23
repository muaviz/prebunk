import Link from "next/link";
import { IslamicLogo } from "@/components/ui/islamic-logo";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <IslamicLogo className="h-6 w-6 text-primary" />
          <span className="font-bold tracking-tight text-lg">PREBUNK</span>
        </Link>
      </div>
    </header>
  );
}
