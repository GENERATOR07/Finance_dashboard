import { useMemo } from "react"
import { Cell, PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts"

import type { CategoryTotal } from "types/finance"

interface CategoryBreakdownChartProps {
  data: CategoryTotal[]
  darkMode: boolean
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
]

const CategoryBreakdownChart = ({
  data,
  darkMode,
}: CategoryBreakdownChartProps) => {
  const chartData = useMemo(
    () =>
      data.slice(0, 8).map((item, index) => ({
        name: item.category,
        value: item.total,
        fill: COLORS[index % COLORS.length],
      })),
    [data]
  )
  const totalValue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  )

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-foreground">Spending by Category</h3>
      <div className="h-[260px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={80}
              paddingAngle={2}
              isAnimationActive={false}
              labelLine={false}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="truncate text-sm text-foreground">{item.name}</span>
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">
              {item.value > 0 && totalValue > 0
                ? `${Math.round((item.value / totalValue) * 100)}%`
                : "0%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryBreakdownChart
