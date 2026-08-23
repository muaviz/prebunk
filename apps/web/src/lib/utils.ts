import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVrsColor(score: number) {
  if (score < 30) return "text-green-600 border-green-600/30 bg-green-50";
  if (score < 60) return "text-yellow-600 border-yellow-600/30 bg-yellow-50";
  if (score < 80) return "text-orange-600 border-orange-600/30 bg-orange-50";
  return "text-red-600 border-red-600/30 bg-red-50";
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
