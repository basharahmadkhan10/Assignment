"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function OverviewChart({ chartData, chartConfig }: { chartData: any[], chartConfig: any }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeWidth={2} />
        <XAxis
          dataKey="status"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="font-bold text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          className="font-bold text-xs"
          allowDecimals={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar
          dataKey="count"
          strokeWidth={4}
          stroke="var(--color-foreground)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
