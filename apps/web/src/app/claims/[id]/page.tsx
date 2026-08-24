import { fetchApi } from "@/lib/api";
import { Claim } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare, ShieldCheck, ListChecks, Share2 } from "lucide-react";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { Badge } from "@/components/ui/badge";
import { RefutationCard } from "@/components/claims/refutation-card";
import { CopyButton } from "@/components/claims/copy-button";
import { ShareButtons } from "@/components/claims/share-buttons";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const claims = await fetchApi<Claim[]>("/claims/");
    return claims.map((claim) => ({ id: claim.id }));
  } catch {
    return [];
  }
}

export default async function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let claim: Claim | null = null;
  
  try {
    claim = await fetchApi<Claim>(`/claims/${resolvedParams.id}`);
  } catch {
    notFound();
  }
  
  if (!claim) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
      <SiteHeader />
      
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-24 pt-28">
        <div className="mb-8">
          <Link href="/claims" className="inline-flex items-center rounded-full border border-border/70 bg-card/30 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to all claims
          </Link>
        </div>

        {/* Hero Area */}
        <ScrollReveal className="mb-16 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline" className="uppercase tracking-wider text-xs bg-primary/5 text-primary border-primary/20">
              {claim.category}
            </Badge>
            <div className="text-xs font-medium text-muted-foreground flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${claim.virality_score > 70 ? 'bg-red-500' : 'bg-orange-400'}`}></span>
              Virality Score: {claim.virality_score}
            </div>
          </div>
          
          <h1 className="mb-8 font-display text-5xl font-bold tracking-[-0.035em] md:text-6xl">
            {claim.title}
          </h1>
          
          <div className="bg-red-950/35 border border-red-900/60 rounded-2xl p-6 md:p-8 mb-8">
            <p className="text-xl md:text-2xl font-medium text-red-200 italic leading-relaxed">
              &quot;{claim.claim_text}&quot;
            </p>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground mb-8">
            <p>{claim.description}</p>
          </div>
          
          {claim.promoter_links && claim.promoter_links.length > 0 && (
            <div className="border border-border/70 rounded-xl p-5 bg-card/40">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-orange-500 rounded-full inline-block"></span>
                Recent Sightings & Sources Promoting This Claim:
              </h4>
              <ul className="flex flex-col gap-2">
                {claim.promoter_links.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background hover:bg-muted/50 border border-border/50 text-sm transition-colors group w-full sm:w-auto">
                      <span className="text-primary group-hover:text-primary/80 font-medium">{link.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">{link.platform}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content: Refutations */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold">Factual Refutations</h2>
              </div>
              
              <div className="grid gap-6">
                {claim.refutations && claim.refutations.length > 0 ? (
                  claim.refutations.map((ref, idx) => (
                    <RefutationCard key={idx} refutation={ref} />
                  ))
                ) : (
                  <p className="text-muted-foreground">No refutations available yet.</p>
                )}
              </div>
            </section>
          </div>
          
          {/* Sidebar: Scripts & Talking Points */}
          <div className="space-y-8">
            {claim.personal_script && (
              <section className="glass-surface rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <MessageSquare className="w-5 h-5" />
                    <h3>How to Respond</h3>
                  </div>
                </div>
                <div className="bg-background border border-primary/10 rounded-xl p-4 mb-4 text-sm leading-relaxed text-foreground shadow-inner">
                  &quot;{claim.personal_script}&quot;
                </div>
                <CopyButton textToCopy={claim.personal_script} />
              </section>
            )}

            <section className="glass-surface rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold">
                <ListChecks className="w-5 h-5 text-primary" />
                <h3>Quick Talking Points</h3>
              </div>
              <ul className="space-y-4">
                {claim.talking_points && claim.talking_points.length > 0 ? (
                  claim.talking_points.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs border border-primary/20">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{point}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">No talking points available.</li>
                )}
              </ul>
            </section>

            <section className="glass-surface rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold">
                <Share2 className="w-5 h-5 text-accent" />
                <h3>Help Stop the Spread</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Warn others that this claim is false by sharing this prebunk directly to your feed.
              </p>
              <ShareButtons claim={claim} />
            </section>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
