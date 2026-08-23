import { Brief } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BriefContentDisplay({ brief }: { brief: Brief }) {
  return (
    <div className="space-y-6 mt-8">
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border bg-background/30 pb-4">
          <CardTitle className="text-lg">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground">{brief.content.summary}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border bg-background/30 pb-4">
            <CardTitle className="text-lg">The Technique</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="prose prose-invert prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
              {brief.content.technique_explanation}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border bg-background/30 pb-4">
            <CardTitle className="text-lg">What This Narrative Claims</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="prose prose-invert prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
              {brief.content.narrative_context}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border bg-background/30 pb-4">
          <CardTitle className="text-lg">Talking Points</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-3 list-decimal list-inside text-muted-foreground">
            {brief.content.talking_points.map((tp, i) => (
              <li key={i} className="pl-2">{tp}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-sky-950/20 border-sky-900/50">
        <CardHeader className="border-b border-sky-900/30 bg-sky-950/40 pb-4">
          <CardTitle className="text-lg text-primary">What to Say</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <blockquote className="border-l-4 border-sky-500 pl-4 italic text-muted-foreground text-lg">
            "{brief.content.personal_script}"
          </blockquote>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border bg-background/30 pb-4">
          <CardTitle className="text-lg">Discussion Questions</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-3 list-disc list-inside text-muted-foreground">
            {brief.content.discussion_questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
