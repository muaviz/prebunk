import { fetchApi } from "@/lib/api";
import { Claim } from "@/types";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { ClaimCard } from "@/components/claims/claim-card";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export const revalidate = 60;

export default async function ClaimsPage() {
  let claims: Claim[] = [];
  try {
    claims = await fetchApi<Claim[]>("/claims/");
  } catch (error) {
    console.error("Failed to fetch claims:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="relative flex-1 overflow-hidden bg-background py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(63,128,93,0.14),transparent_34%)]" />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <ScrollReveal className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Narrative intelligence</p>
            <h1 className="font-display text-5xl font-bold tracking-[-0.035em] text-foreground md:text-6xl">Claim Database</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Browse our comprehensive database of debunked anti-Muslim tropes.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={50} className="mb-10 border border-yellow-500/30 bg-yellow-500/10 p-4 rounded-lg flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-medium text-yellow-500/90 text-sm mb-1">Content Warning</h4>
              <p className="text-xs text-muted-foreground">
                This page contains examples of anti-Muslim hate speech and Islamophobic tropes. 
                These claims are presented solely for educational debunking and analytical purposes.
              </p>
            </div>
          </ScrollReveal>
          
          {claims.length === 0 ? (
            <div className="glass-surface rounded-2xl py-20 text-center">
              <p className="text-muted-foreground">No claims found in the database.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {claims.map((claim, index) => (
                <ScrollReveal key={claim.id} delay={index * 60}>
                  <ClaimCard claim={claim} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
