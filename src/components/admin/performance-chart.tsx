"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RevenueChart({
  data,
}: {
  data: Array<{ month: string; revenue: number; profit: number }>;
}) {
  return (
    <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Revenue & profit</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[260px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-white/55"
          config={{
            revenue: { label: "Revenue", color: "var(--color-chart-3)" },
            profit: { label: "Profit", color: "var(--color-chart-1)" },
          }}
        >
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-chart-3)" radius={8} />
            <Bar dataKey="profit" fill="var(--color-chart-1)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ProfitTrendChart({
  data,
}: {
  data: Array<{ month: string; revenue: number; profit: number; expenses: number }>;
}) {
  return (
    <Card className="rounded-[28px] border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Trendline mensuelle</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[260px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-white/55"
          config={{
            revenue: { label: "Revenue", color: "var(--color-chart-1)" },
            profit: { label: "Profit", color: "var(--color-chart-2)" },
            expenses: { label: "Expenses", color: "var(--color-chart-4)" },
          }}
        >
          <LineChart data={data}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="profit" stroke="var(--color-chart-2)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="expenses" stroke="var(--color-chart-4)" strokeWidth={3} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
