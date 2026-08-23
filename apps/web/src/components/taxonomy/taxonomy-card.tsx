import Link from "next/link";
import { Narrative } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TaxonomyCard({ narrative }: { narrative: Narrative }) {
  return (
    <Link href={`/taxonomy/${narrative.id}`}>
      <Card className="h-full bg-slate-900 border-slate-800 hover:border-sky-500/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className="bg-slate-950 border-slate-700 text-slate-300">
              {narrative.cluster_id}
            </Badge>
            <Badge variant="outline" className="bg-sky-500/10 border-sky-500/20 text-sky-400">
              {narrative.technique_id.replace("_", " ")}
            </Badge>
          </div>
          <CardTitle className="text-xl text-slate-200 group-hover:text-sky-400 transition-colors line-clamp-2">
            {narrative.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 line-clamp-3">
            {narrative.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
