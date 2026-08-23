"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

export function SettingsForm({ subscriber, clusters }: { subscriber: any, clusters: string[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [prefs, setPrefs] = useState({
    email_delivery: subscriber.notification_preferences?.email_delivery || "weekly",
    language: subscriber.notification_preferences?.language || "en",
    focus_clusters: subscriber.focus_clusters || []
  });

  const toggleCluster = (cluster: string) => {
    setPrefs(prev => {
      const current = prev.focus_clusters;
      if (current.includes(cluster)) {
        return { ...prev, focus_clusters: current.filter((c: string) => c !== cluster) };
      } else {
        return { ...prev, focus_clusters: [...current, cluster] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    
    try {
      await fetchApi(`/subscribers/${subscriber.id}/preferences`, {
        method: "PATCH",
        body: JSON.stringify({
          notification_preferences: {
            email_delivery: prefs.email_delivery,
            language: prefs.language
          },
          focus_clusters: prefs.focus_clusters
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl">Delivery Preferences</CardTitle>
          <CardDescription className="text-slate-400">Configure how and when you receive inoculation briefs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Email Delivery Frequency</label>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="delivery" 
                  value="realtime" 
                  checked={prefs.email_delivery === "realtime"}
                  onChange={() => setPrefs({...prefs, email_delivery: "realtime"})}
                  className="text-sky-500 bg-slate-950 border-slate-700"
                />
                <span className="text-slate-300">Real-time (when a monitored narrative spikes)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="delivery" 
                  value="weekly" 
                  checked={prefs.email_delivery === "weekly"}
                  onChange={() => setPrefs({...prefs, email_delivery: "weekly"})}
                  className="text-sky-500 bg-slate-950 border-slate-700"
                />
                <span className="text-slate-300">Weekly Digest (top threats of the week)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="delivery" 
                  value="none" 
                  checked={prefs.email_delivery === "none"}
                  onChange={() => setPrefs({...prefs, email_delivery: "none"})}
                  className="text-sky-500 bg-slate-950 border-slate-700"
                />
                <span className="text-slate-300">None (dashboard access only)</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Language Preference</label>
            <select
              value={prefs.language}
              onChange={e => setPrefs({...prefs, language: e.target.value})}
              className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl">Focus Clusters</CardTitle>
          <CardDescription className="text-slate-400">Select which narrative clusters are most relevant to your community. We will prioritize these in your digests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {clusters.map(cluster => (
              <button
                key={cluster}
                type="button"
                onClick={() => toggleCluster(cluster)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  prefs.focus_clusters.includes(cluster)
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {cluster}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="bg-sky-500 hover:bg-sky-600 text-white"
        >
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Preferences"}
        </Button>
        {saved && (
          <span className="text-emerald-400 text-sm flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1" /> Settings saved
          </span>
        )}
      </div>
    </form>
  );
}
