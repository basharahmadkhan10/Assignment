import { getAdminAnalytics } from "@/actions/analytics"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default async function OverviewPage() {
  const analytics = await getAdminAnalytics()

  const chartData = [
    { status: "CONFIRMED", count: analytics.orderStats.CONFIRMED, fill: "oklch(0.65 0.2 140)" },
    { status: "PENDING", count: analytics.orderStats.PENDING, fill: "oklch(0.75 0.15 70)" },
    { status: "CANCELLED", count: analytics.orderStats.CANCELLED, fill: "oklch(0.6 0.2 20)" },
  ]

  const chartConfig = {
    count: {
      label: "Orders",
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Overview</h1>
        <p className="text-muted-foreground font-medium uppercase text-xs">Admin dashboard analytics and statistics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-4 border-foreground shadow-[6px_6px_0px_0px_var(--color-foreground)] rounded-none">
          <CardHeader className="bg-primary border-b-4 border-foreground text-primary-foreground">
            <CardTitle className="uppercase font-black">Total Products</CardTitle>
            <CardDescription className="text-primary-foreground/80 font-medium">Unique items in inventory</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-5xl font-black">{analytics.totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="border-4 border-foreground shadow-[6px_6px_0px_0px_var(--color-foreground)] rounded-none">
          <CardHeader className="bg-primary border-b-4 border-foreground text-primary-foreground">
            <CardTitle className="uppercase font-black">Total Orders</CardTitle>
            <CardDescription className="text-primary-foreground/80 font-medium">All time order requests</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-5xl font-black">{analytics.totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_var(--color-foreground)] rounded-none">
        <CardHeader className="border-b-4 border-foreground bg-muted">
          <CardTitle className="uppercase font-black">Order Status Overview</CardTitle>
          <CardDescription className="font-medium">Number of orders by their current status</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
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
        </CardContent>
      </Card>
    </div>
  )
}
