import { cn } from "@/lib/utils";

export function VrsBadge({ score, className }: { score: number; className?: string }) {
  let colorClass = "";
  let label = "";

  if (score < 30) {
    colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    label = "Monitor";
  } else if (score < 60) {
    colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    label = "Watch";
  } else if (score < 80) {
    colorClass = "bg-orange-500/10 text-orange-400 border-orange-500/30";
    label = "Alert";
  } else {
    colorClass = "bg-red-500/10 text-red-400 border-red-500/30";
    label = "Critical";
  }

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border", colorClass, className)}>
      <span className="font-semibold mr-1">{score.toFixed(1)}</span>
      <span className="opacity-80">{label}</span>
    </span>
  );
}
