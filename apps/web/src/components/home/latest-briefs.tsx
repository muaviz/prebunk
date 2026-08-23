import Link from "next/link";
import { Brief } from "@/types";
import { BriefCard } from "@/components/briefs/brief-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LatestBriefs({ briefs }: { briefs: Brief[] }) {
  if (!briefs || briefs.length === 0) {
    return (
      <section className="py-24 max-w-5xl mx-auto px-6 bg-background">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Latest Inoculation Briefs</h2>
          <div className="p-8 border border-border rounded-md bg-muted text-muted-foreground">
            No briefs generated yet.
          </div>
        </div>
      </section>
    );
  }

  const latest = briefs.slice(0, 3);

  return (
    <section className="py-24 max-w-5xl mx-auto px-6 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Latest Inoculation Briefs</h2>
          <p className="text-muted-foreground mt-2">AI-generated educational content ready to share.</p>
        </div>
        <Link href="/briefs" className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}>
          View All Briefs &rarr;
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latest.map(brief => (
          <BriefCard key={brief.id} brief={brief} />
        ))}
      </div>
    </section>
  );
}
