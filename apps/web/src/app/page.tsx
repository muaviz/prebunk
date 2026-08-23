import Link from "next/link";
import { Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50" suppressHydrationWarning>
      <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full z-50">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-sky-400" suppressHydrationWarning />
          <span className="text-xl font-bold tracking-tight">PREBUNK</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/taxonomy" className="text-sm font-medium text-slate-300 hover:text-white hidden md:block">
            Taxonomy
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "default" }), "bg-sky-500 hover:bg-sky-600 text-white")}>
            Request Access
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
      </main>

      <footer className="py-8 text-center text-sm text-slate-500 border-t border-slate-900">
        Built for the 2026 Harvest Anti-Muslim Hate Hackathon.<br/>
        © 2026 Prebunk Initiative. All rights reserved.
      </footer>
    </div>
  );
}
