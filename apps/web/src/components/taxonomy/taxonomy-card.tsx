import Link from "next/link";
import { Narrative } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TaxonomyCard({ narrative }: { narrative: Narrative }) {
  return (
    <Link href={`/taxonomy/${narrative.id}`}>
      <Card className="h-full bg-card border-border hover:border-sky-500/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className="bg-background border-border text-muted-foreground">
              {narrative.cluster_id}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 border-sky-500/20 text-primary">
              {narrative.technique_id.replace("_", " ")}
            </Badge>
          </div>
          <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {narrative.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {narrative.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
