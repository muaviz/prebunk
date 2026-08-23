import { cn } from "@/lib/utils";

export function IslamicLogo({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={cn("lucide", className)}
    >
      <rect x="5.5" y="5.5" width="13" height="13" rx="1" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="1" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
