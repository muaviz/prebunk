import Link from "next/link";
import { IslamicLogo } from "@/components/ui/islamic-logo";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  layout?: "hero" | "standard" | "wide";
}

export function SiteHeader({ layout = "standard" }: SiteHeaderProps) {
  const innerContent = (
    <Link href="/" className="flex items-center gap-2 text-foreground">
      <IslamicLogo className="h-6 w-6 text-primary" />
      <span className="text-lg font-bold tracking-tight">PREBUNK</span>
    </Link>
  );

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
      {layout === "hero" ? (
        <div className="grid w-full lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
          <div className="mx-auto flex h-16 w-full max-w-[44rem] items-center px-6 lg:translate-x-10 lg:px-10">
            {innerContent}
          </div>
        </div>
      ) : (
        <div className={cn("mx-auto flex h-16 w-full items-center px-6", layout === "wide" ? "max-w-6xl" : "max-w-5xl")}>
          {innerContent}
        </div>
      )}
    </header>
  );
}
