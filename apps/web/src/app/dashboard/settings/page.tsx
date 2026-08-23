import { fetchApi } from "@/lib/api";
import { Narrative } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return <div>Not authenticated</div>;
  }

    let subscriber = null;
  try {
    subscriber = await fetchApi<any>(`/subscribers/user/${user.id}`);
  } catch (error) {
    console.warn("Subscriber record not found. Falling back to default preferences.");
    subscriber = {
      id: user.id,
      notification_preferences: { email_delivery: "none", language: "en" },
      focus_clusters: []
    };
  }
  const narratives = await fetchApi<Narrative[]>("/narratives/");
  const clusters = Array.from(new Set(narratives.map(n => n.cluster_id))).sort();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your email delivery preferences and focus areas.
        </p>
      </div>

      <SettingsForm subscriber={subscriber} clusters={clusters} />
    </div>
  );
}
