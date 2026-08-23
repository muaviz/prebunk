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

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const claims = await fetchApi<Claim[]>("/claims/");
    return claims.map((claim) => ({ id: claim.id }));
  } catch (error) {
    return [];
  }
}

export default async function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let claim: Claim | null = null;
  
  try {
    claim = await fetchApi<Claim>(`/claims/${resolvedParams.id}`);
  } catch (error) {
    notFound();
  }
  
  if (!claim) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
      <SiteHeader />
      
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <Link href="/claims" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to all claims
          </Link>
        </div>

        {/* Hero Area */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline" className="uppercase tracking-wider text-xs bg-primary/5 text-primary border-primary/20">
              {claim.category}
            </Badge>
            <div className="text-xs font-medium text-muted-foreground flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${claim.virality_score > 70 ? 'bg-red-500' : 'bg-orange-400'}`}></span>
              Virality Score: {claim.virality_score}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
            {claim.title}
          </h1>
          
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 md:p-8 mb-8">
            <p className="text-xl md:text-2xl font-medium text-red-900 italic leading-relaxed">
              "{claim.claim_text}"
            </p>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
            <p>{claim.description}</p>
          </div>
        </div>

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
              <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <MessageSquare className="w-5 h-5" />
                    <h3>How to Respond</h3>
                  </div>
                </div>
                <div className="bg-background border border-primary/10 rounded-xl p-4 mb-4 text-sm leading-relaxed text-foreground shadow-inner">
                  "{claim.personal_script}"
                </div>
                <CopyButton textToCopy={claim.personal_script} />
              </section>
            )}

            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold">
                <ListChecks className="w-5 h-5 text-indigo-500" />
                <h3>Quick Talking Points</h3>
              </div>
              <ul className="space-y-4">
                {claim.talking_points && claim.talking_points.length > 0 ? (
                  claim.talking_points.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-xs border border-indigo-100">
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

            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold">
                <Share2 className="w-5 h-5 text-blue-500" />
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
