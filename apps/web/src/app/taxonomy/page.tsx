import { fetchApi } from "@/lib/api";
import { Narrative } from "@/types";
import { TaxonomyList } from "@/components/taxonomy/taxonomy-list";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";

export const revalidate = 3600; // Revalidate every hour

export default async function TaxonomyBrowserPage() {
  const narratives = await fetchApi<Narrative[]>("/narratives/").catch(() => []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Narrative Taxonomy</h1>
          <p className="text-muted-foreground max-w-3xl">
            An open-source encyclopedia of known anti-Muslim rhetoric, structural conspiracy theories, 
            and manipulative tropes. Use this browser to identify and understand coordinated campaigns.
          </p>
        </div>
        
        <TaxonomyList narratives={narratives} />
      </main>
      
      <SiteFooter />
    </div>
  );
}
