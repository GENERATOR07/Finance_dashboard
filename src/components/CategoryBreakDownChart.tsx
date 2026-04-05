import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts"
import type { CategoryTotal } from "../../types/finance"

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
  const chartData = data.slice(0, 8).map((item, index) => ({
    name: item.category,
    value: item.total,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-foreground">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(0)}%`
            }
            outerRadius={80}
            dataKey="value"
          />
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
  )
}

export default CategoryBreakdownChart
