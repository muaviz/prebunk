import { redirect } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { CommunityTip, Narrative } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { TipSubmissionForm } from "@/components/tips/tip-submission-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";

export default async function TipsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Fetch tips for this user
  const tips = await fetchApi<CommunityTip[]>(`/tips/?user_id=${user.id}`);
  const narratives = await fetchApi<Narrative[]>("/narratives/");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community Tip Line</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Report suspicious coordinated campaigns or new manipulative narratives you've observed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl">Submit a Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <TipSubmissionForm userId={user.id} narratives={narratives} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Submissions</h2>
          
          {tips.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-border rounded-lg text-muted-foreground">
              You haven't submitted any tips yet.
            </div>
          ) : (
            <div className="space-y-4">
              {tips.map(tip => (
                <Card key={tip.id} className="bg-card border-border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(tip.created_at).toLocaleDateString()}
                      </div>
                      <TipStatusBadge status={tip.status} />
                    </div>
                    <p className="text-sm text-foreground line-clamp-3">{tip.description}</p>
                    {(tip.platform || tip.source_url) && (
                      <div className="text-xs text-muted-foreground flex gap-2">
                        {tip.platform && <span className="bg-muted px-2 py-1 rounded">{tip.platform}</span>}
                        {tip.source_url && <span className="truncate max-w-[200px]">{tip.source_url}</span>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TipStatusBadge({ status }: { status: string }) {
  switch(status) {
    case 'pending':
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20" variant="outline">Pending Review</Badge>;
    case 'reviewed':
      return <Badge className="bg-primary/10 text-primary border-sky-500/20" variant="outline">Reviewed</Badge>;
    case 'confirmed':
      return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" variant="outline"><CheckCircle2 className="w-3 h-3 mr-1"/> Confirmed</Badge>;
    case 'rejected':
      return <Badge className="bg-muted text-muted-foreground border-border" variant="outline"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
