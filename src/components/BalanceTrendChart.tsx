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
import type { MonthlyData } from "../../types/finance"

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
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-foreground">Balance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={darkMode ? "#374151" : "#e5e7eb"}
          />
          <XAxis
            dataKey="month"
            stroke={darkMode ? "#9ca3af" : "#6b7280"}
            style={{ fontSize: "0.75rem" }}
          />
          <YAxis
            stroke={darkMode ? "#9ca3af" : "#6b7280"}
            style={{ fontSize: "0.75rem" }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
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
          <Legend wrapperStyle={{ fontSize: "0.875rem" }} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
