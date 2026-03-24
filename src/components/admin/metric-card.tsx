import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="rounded-[28px] border-white/10 bg-white/5 text-white shadow-2xl shadow-slate-950/20">
      <CardContent className="flex items-start justify-between p-6">
        <div className="space-y-2">
          <p className="text-sm text-white/60">{title}</p>
          <p className="text-3xl font-semibold">{value}</p>
          <p className="text-sm text-white/50">{hint}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3">
          <Icon className="size-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
