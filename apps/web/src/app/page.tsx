import { fetchApi } from "@/lib/api";
import { Claim } from "@/types";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ExtensionPromo } from "@/components/home/extension-promo";
import { FeaturedThreatCard } from "@/components/claims/featured-threat-card";
import { ClaimCard } from "@/components/claims/claim-card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  let claims: Claim[] = [];
  try {
    claims = await fetchApi<Claim[]>("/claims/");
  } catch (error) {
    console.error("Failed to fetch claims:", error);
  }

  const featuredClaims = claims.filter(c => c.is_featured);
  const otherClaims = claims.filter(c => !c.is_featured).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        
        {featuredClaims.length > 0 && (
          <section id="featured" className="py-20 bg-muted/30">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                  </span>
                  High Alert: Emerging Threats
                </h2>
                <p className="text-muted-foreground mt-3">These claims are showing early signs of coordinated spread. Prepare yourself for these conversations.</p>
              </div>
              <div className="space-y-6">
                {featuredClaims.map(claim => (
                  <FeaturedThreatCard key={claim.id} claim={claim} />
                ))}
              </div>
            </div>
          </section>
        )}

        <HowItWorks />
        
        {otherClaims.length > 0 && (
          <section className="py-24 bg-background">
            <div className="max-w-5xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Recently Tracked Claims</h2>
                  <p className="text-muted-foreground mt-2">Explore our database of tracked anti-Muslim narratives.</p>
                </div>
                <Link href="/claims" className={buttonVariants({ variant: "outline" })}>
                  View All Claims &rarr;
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherClaims.map(claim => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
              </div>
            </div>
          </section>
        )}

        <ExtensionPromo />
      </main>
      <SiteFooter />
    </div>
  );
}
