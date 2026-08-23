import Link from "next/link";
import { Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center p-6 max-w-4xl mx-auto space-y-8 pt-24 pb-16">
      <div className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm font-medium text-sky-400">
        <span className="flex h-2 w-2 rounded-full bg-sky-400 mr-2 animate-pulse"></span>
        Now monitoring real-time threat velocity
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-slate-50">
        A weather radar for<br />Islamophobia.
      </h1>
      <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Forecast which anti-Muslim narratives will go viral — and inoculate communities before they do.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Link href="/taxonomy" className={cn(buttonVariants({ size: "lg" }), "bg-sky-500 hover:bg-sky-600 text-white w-full sm:w-auto text-base")}>
          Browse the Taxonomy
        </Link>
        <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 w-full sm:w-auto text-base")}>
          Dashboard Login
        </Link>
      </div>
    </section>
  );
}
