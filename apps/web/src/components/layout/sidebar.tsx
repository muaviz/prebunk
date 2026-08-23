import { Shield, Radar, TrendingUp, FileText, Bell, Lightbulb, Settings, Zap } from "lucide-react";
import { NavLink } from "./nav-link";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-2">
        <Shield className="h-6 w-6 text-sky-400" />
        <span className="text-lg font-bold tracking-tight text-slate-50">PREBUNK</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink href="/dashboard" icon={<Radar className="h-4 w-4" />}>Radar</NavLink>
        <NavLink href="/dashboard/trends" icon={<TrendingUp className="h-4 w-4" />}>Trends</NavLink>
        <NavLink href="/dashboard/briefs" icon={<FileText className="h-4 w-4" />}>Briefs</NavLink>
        <NavLink href="/dashboard/alerts" icon={<Bell className="h-4 w-4" />}>Alerts</NavLink>
        <NavLink href="/dashboard/tips" icon={<Lightbulb className="h-4 w-4" />}>Tips</NavLink>
        <NavLink href="/dashboard/generate" icon={<Zap className="h-4 w-4" />}>Generate</NavLink>
        <NavLink href="/dashboard/settings" icon={<Settings className="h-4 w-4" />}>Settings</NavLink>
      </nav>
    </aside>
  );
}
