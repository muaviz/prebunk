import Link from "next/link";
import { Shield } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center p-6 max-w-4xl mx-auto space-y-8 pt-24 pb-16">
      <h1 className="text-5xl font-bold tracking-tight sm:text-7xl text-foreground">
        A weather radar for<br />Islamophobia.
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Forecast which anti-Muslim narratives will go viral — and inoculate communities before they do.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Link href="/taxonomy" className={cn(buttonVariants({ size: "lg" }), "bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-base border-none")}>
          Browse the Taxonomy
        </Link>
        <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-border bg-transparent hover:bg-muted text-foreground w-full sm:w-auto text-base")}>
          Dashboard Login
        </Link>
      </div>
    </section>
  );
}
