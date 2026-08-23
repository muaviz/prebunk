import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

export function StatWidget({ title, value, subtitle, icon }: { title: string, value: string | number, subtitle?: string, icon?: ReactNode }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        {icon && <div className="text-slate-500">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-50">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
