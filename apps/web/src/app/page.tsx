import { fetchApi } from "@/lib/api";
import { Narrative, VrsScore, Brief } from "@/types";
import { SiteHeader } from "@/components/home/site-header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LiveTracker } from "@/components/home/live-tracker";
import { LatestBriefs } from "@/components/home/latest-briefs";
import { ExtensionPromo } from "@/components/home/extension-promo";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { SiteFooter } from "@/components/home/site-footer";

export default async function Home() {
  // Fetch required data for the homepage
  const [narratives, vrsScores, clusters, briefs] = await Promise.all([
    fetchApi<Narrative[]>("/narratives/").catch(() => []),
    fetchApi<VrsScore[]>("/vrs/?latest=false").catch(() => []),
    fetchApi<{id: string, name: string}[]>("/clusters/").catch(() => []),
    fetchApi<Brief[]>("/briefs/").catch(() => [])
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <LiveTracker narratives={narratives} vrsScores={vrsScores} clusters={clusters} />
        <LatestBriefs briefs={briefs} />
        <ExtensionPromo />
        <NewsletterForm />
      </main>
      <SiteFooter />
    </div>
  );
}
