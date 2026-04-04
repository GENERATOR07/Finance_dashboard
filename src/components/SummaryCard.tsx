import type { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  title: string
  amount: number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  colorClass?: string
}

const SummaryCard = ({
  title,
  amount,
  icon: Icon,
  trend,
  colorClass = "bg-primary",
}: SummaryCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
            {title}
          </p>
          <h2 className="mt-2 text-foreground">
            $
            {amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          {trend && (
            <p
              className={`mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
              style={{ fontSize: "0.875rem" }}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value.toFixed(1)}% from last month
            </p>
          )}
        </div>
        <div className={`${colorClass} rounded-lg p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
