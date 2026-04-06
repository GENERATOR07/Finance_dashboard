import { useMemo } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { MonthlyData } from "types/finance"

interface BalanceTrendChartProps {
  data?: MonthlyData[]
  darkMode: boolean
}

const DEFAULT_DATA: MonthlyData[] = [
  { month: "Jan", income: 8000, expenses: 3800, balance: 4200 },
  { month: "Feb", income: 9000, expenses: 3900, balance: 5100 },
  { month: "Mar", income: 7500, expenses: 2700, balance: 4800 },
  { month: "Apr", income: 9200, expenses: 3600, balance: 5600 },
  { month: "May", income: 10000, expenses: 3800, balance: 6200 },
  { month: "Jun", income: 9500, expenses: 3600, balance: 5900 },
]

export const BalanceTrendChart = ({
  data = DEFAULT_DATA,
  darkMode,
}: BalanceTrendChartProps) => {
  const chartData = useMemo(() => data, [data])
  const axisColor = darkMode ? "#9ca3af" : "#6b7280"
  const gridColor = darkMode ? "#374151" : "#e5e7eb"
  const tooltipBackground = darkMode ? "#1f2937" : "#ffffff"
  const tooltipBorder = darkMode ? "#374151" : "#e5e7eb"
  const formatAxisAmount = (value: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-foreground">Balance Trend</h3>
        <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground sm:h-[300px]">
          No monthly trend data yet
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-foreground">Balance Trend</h3>
      <div className="h-[260px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -20, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="month"
            stroke={axisColor}
            style={{ fontSize: "0.75rem" }}
            tickFormatter={(value: string) => value.split(" ")[0]}
            minTickGap={24}
            tickMargin={8}
          />
          <YAxis
            stroke={axisColor}
            style={{ fontSize: "0.75rem" }}
            width={44}
            tickFormatter={(value: number) => `$${formatAxisAmount(value)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBackground,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}
            formatter={(value) => {
              const v = Array.isArray(value) ? value[0] : value
              if (v === undefined || v === null) return ""
              const num = typeof v === "number" ? v : Number(v)
              if (Number.isNaN(num)) return String(v)
              return `$${num.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            }}
          />
          <Legend
            wrapperStyle={{ color: axisColor, fontSize: "0.75rem" }}
            iconSize={10}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            name="Income"
            dot={false}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            name="Expenses"
            dot={false}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Balance"
            dot={false}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}
