import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from "lucide-react"

import {
  calculateTotals,
  getMonthlyComparison,
  getTopCategory,
} from "@/utils/calculations"
import type { Transaction } from "@/types/finance"

interface InsightsSectionProps {
  transactions: Transaction[]
}

export const InsightsSection = ({ transactions }: InsightsSectionProps) => {
  const topCategory = getTopCategory(transactions)
  const monthlyComparison = getMonthlyComparison(transactions)
  const totals = calculateTotals(transactions)
  const savingsRate =
    totals.totalIncome > 0
      ? ((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100
      : 0

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-foreground">Financial Insights</h3>

      <div className="space-y-4">
        {/* Highest Spending Category */}
        {topCategory && (
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
            <div className="rounded-lg bg-destructive/10 p-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h4
                className="text-foreground"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Highest Spending Category
              </h4>
              <p
                className="mt-1 text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                You spent the most on{" "}
                <span className="font-medium text-foreground">
                  {topCategory.category}
                </span>{" "}
                with a total of{" "}
                <span className="font-medium text-foreground">
                  $
                  {topCategory.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Monthly Comparison */}
        <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
          <div
            className={`rounded-lg p-2 ${monthlyComparison.change > 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"}`}
          >
            {monthlyComparison.change > 0 ? (
              <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div className="flex-1">
            <h4
              className="text-foreground"
              style={{
                fontSize: "0.875rem",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Monthly Comparison
            </h4>
            <p
              className="mt-1 text-muted-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              Your spending this month{" "}
              {monthlyComparison.change > 0 ? (
                <>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    increased by {Math.abs(monthlyComparison.change).toFixed(1)}
                    %
                  </span>{" "}
                  compared to last month
                </>
              ) : monthlyComparison.change < 0 ? (
                <>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    decreased by {Math.abs(monthlyComparison.change).toFixed(1)}
                    %
                  </span>{" "}
                  compared to last month
                </>
              ) : (
                "remained the same as last month"
              )}
            </p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
          <div
            className={`rounded-lg p-2 ${savingsRate > 20 ? "bg-green-100 dark:bg-green-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"}`}
          >
            <DollarSign
              className={`h-5 w-5 ${savingsRate > 20 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}
            />
          </div>
          <div className="flex-1">
            <h4
              className="text-foreground"
              style={{
                fontSize: "0.875rem",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Savings Rate
            </h4>
            <p
              className="mt-1 text-muted-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              You're saving{" "}
              <span className="font-medium text-foreground">
                {savingsRate.toFixed(1)}%
              </span>{" "}
              of your income.
              {savingsRate > 20 ? (
                <span className="text-green-600 dark:text-green-400">
                  {" "}
                  Great job!
                </span>
              ) : savingsRate > 0 ? (
                <span className="text-yellow-600 dark:text-yellow-400">
                  {" "}
                  Consider increasing your savings.
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  {" "}
                  You're spending more than you earn.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Average Daily Spending */}
        {transactions.length > 0 && (
          <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4
                className="text-foreground"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Average Daily Spending
              </h4>
              <p
                className="mt-1 text-muted-foreground"
                style={{ fontSize: "0.875rem" }}
              >
                Based on your transactions, you spend an average of{" "}
                <span className="font-medium text-foreground">
                  $
                  {(totals.totalExpenses / 180).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>{" "}
                per day (last 6 months)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default InsightsSection
