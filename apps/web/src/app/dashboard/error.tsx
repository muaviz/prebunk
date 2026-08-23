"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 max-w-md text-center p-8 bg-slate-900 border border-slate-800 rounded-lg shadow-xl">
        <div className="p-3 bg-red-500/10 rounded-full text-red-400">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-200">Something went wrong</h2>
        <p className="text-sm text-slate-400">
          We encountered an error loading the dashboard data. Please try again.
        </p>
        <Button 
          onClick={() => reset()} 
          className="mt-4 bg-slate-800 hover:bg-slate-700 text-white"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
