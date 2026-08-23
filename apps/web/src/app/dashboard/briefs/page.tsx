import { fetchApi } from "@/lib/api";
import { BriefArchiveInteractive } from "@/components/dashboard/brief-filters";
import { Brief } from "@/types";

export default async function BriefsPage() {
  const briefs = await fetchApi<Brief[]>("/briefs/");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Brief Archive</h1>
        <p className="text-sm text-muted-foreground mt-1">Generated inoculation content ready for community distribution.</p>
      </div>

      <BriefArchiveInteractive briefs={briefs} />
    </div>
  );
}
