import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVrsColor(score: number) {
  if (score < 30) return "text-green-300 border-green-500/30 bg-green-950/40";
  if (score < 60) return "text-yellow-300 border-yellow-500/30 bg-yellow-950/40";
  if (score < 80) return "text-orange-300 border-orange-500/30 bg-orange-950/40";
  return "text-red-300 border-red-500/30 bg-red-950/40";
}

export function getVrsLabel(score: number) {
  if (score < 30) return "Monitor";
  if (score < 60) return "Watch";
  if (score < 80) return "Alert";
  return "Critical";
}

export function getVrsHexColor(score: number) {
  if (score < 30) return "#16A34A";
  if (score < 60) return "#CA8A04";
  if (score < 80) return "#EA580C";
  return "#DC2626";
}
