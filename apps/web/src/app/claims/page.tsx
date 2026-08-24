import { fetchApi } from "@/lib/api";
import { Claim } from "@/types";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { ClaimsClient } from "@/components/claims/claims-client";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export const revalidate = 60;

export default async function ClaimsPage() {
  let claims: Claim[] = [];
  try {
    claims = await fetchApi<Claim[]>("/claims/");
  } catch (error: any) {
    console.error(`⚠️ Build Warning: Failed to fetch claims from API (${error.message}). Make sure NEXT_PUBLIC_API_URL is set to your actual Railway deployment.`);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader layout="wide" />
      <main className="relative flex-1 overflow-hidden bg-background py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(63,128,93,0.15),transparent_45%)]" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <ScrollReveal className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Narrative intelligence</p>
            <h1 className="font-display text-4xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl">Claim Database</h1>
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
          
          <ClaimsClient claims={claims} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
