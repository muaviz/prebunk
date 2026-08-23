import { cn, getVrsColor, getVrsLabel } from "@/lib/utils";

export function VrsBadge({ score, className }: { score: number; className?: string }) {
  const colorClass = getVrsColor(score);
  const label = getVrsLabel(score);

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border", colorClass, className)}>
      <span className="font-semibold mr-1">{score.toFixed(1)}</span>
      <span className="opacity-80">{label}</span>
    </span>
  );
}
