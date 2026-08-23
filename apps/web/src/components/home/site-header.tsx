import Link from "next/link";
import { IslamicLogo } from "@/components/ui/islamic-logo";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
      <div className="grid w-full lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <div className="mx-auto flex h-16 w-full max-w-[44rem] items-center px-6 lg:translate-x-10 lg:px-10">
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <IslamicLogo className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">PREBUNK</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
