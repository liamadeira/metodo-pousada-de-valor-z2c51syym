import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  revenue: {
    label: 'Receita (R$)',
    color: 'hsl(var(--primary))',
  },
}

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} fontSize={12} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
