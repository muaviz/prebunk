import { fetchApi } from "@/lib/api";
import { Narrative } from "@/types";
import { BriefGeneratorForm } from "@/components/brief/brief-generator-form";

export default async function GenerateBriefPage({
  searchParams,
}: {
  searchParams: Promise<{ narrative?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const narratives = await fetchApi<Narrative[]>("/narratives/");
  const initialNarrativeId = resolvedSearchParams.narrative;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">On-Demand Brief Generation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analyze suspicious content and instantly generate educational counter-messaging.
        </p>
      </div>

      <BriefGeneratorForm narratives={narratives} initialNarrativeId={initialNarrativeId} />
    </div>
  );
}
