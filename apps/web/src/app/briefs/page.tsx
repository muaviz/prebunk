import { fetchApi } from "@/lib/api";
import { Brief } from "@/types";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { BriefArchiveInteractive } from "@/components/briefs/brief-filters";

export const metadata = {
  title: "Inoculation Briefs | Prebunk",
  description: "Public archive of AI-generated educational content to counter anti-Muslim misinformation.",
};

export default async function BriefsPage() {
  const briefs = await fetchApi<Brief[]>("/briefs/").catch(() => []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 max-w-5xl mx-auto px-6 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Inoculation Briefs</h1>
          <p className="text-muted-foreground mt-2">
            AI-generated educational content ready to share. Browse the archive below.
          </p>
        </div>

        {briefs && briefs.length > 0 ? (
          <BriefArchiveInteractive briefs={briefs} />
        ) : (
          <div className="text-center p-12 bg-muted border border-border rounded-md text-muted-foreground">
            No briefs have been generated yet. Check back soon.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
