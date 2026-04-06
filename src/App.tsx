import { useEffect, useMemo, useState } from "react"
import { ArrowUp, TrendingDown, TrendingUp, Wallet } from "lucide-react"

import { BalanceTrendChart } from "@/components/BalanceTrendChart"
import CategoryBreakdownChart from "@/components/CategoryBreakDownChart"
import Header from "@/components/Header"
import InsightsSection from "@/components/InsightsSection"
import SummaryCard from "@/components/SummaryCard"
import TransactionList from "@/components/TransactionList"
import useFinance from "@/hooks/useFinance"
import { useTheme } from "@/providers/theme-provider"
import { Button } from "@/components/ui/button"
import {
  calculateTotals,
  getCategoryTotals,
  getMonthlyData,
} from "@/utils/calculations"

export function App() {
  const { transactions, isLoading, error } = useFinance()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [areChartsReady, setAreChartsReady] = useState(false)
  const total = useMemo(() => calculateTotals(transactions), [transactions])
  const monthlyData = useMemo(
    () => getMonthlyData(transactions),
    [transactions]
  )
  const categoryTotals = useMemo(
    () => getCategoryTotals(transactions),
    [transactions]
  )
  const { theme, setTheme } = useTheme()
  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  useEffect(() => {
    if (isLoading || error) {
      setAreChartsReady(false)
      return
    }

    let isActive = true
    let animationFrameId = 0

    animationFrameId = window.requestAnimationFrame(() => {
      animationFrameId = window.requestAnimationFrame(() => {
        if (isActive) {
          setAreChartsReady(true)
        }
      })
    })

    return () => {
      isActive = false
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [isLoading, error])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen">
      <Header darkMode={theme === "dark"} toggleDarkMode={handleClick} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading financial data...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <SummaryCard
                title="Balance"
                amount={total.balance}
                icon={Wallet}
                colorClass="bg-blue-500"
              />
              <SummaryCard
                title="Total Income"
                amount={total.totalIncome}
                icon={TrendingUp}
                colorClass="bg-green-500"
              />
              <SummaryCard
                title="Total Expenses"
                amount={total.totalExpenses}
                icon={TrendingDown}
                colorClass="bg-red-500"
              />
            </div>
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {areChartsReady ? (
                <>
                  <BalanceTrendChart
                    data={monthlyData}
                    darkMode={theme === "dark"}
                  />
                  <CategoryBreakdownChart
                    data={categoryTotals}
                    darkMode={theme === "dark"}
                  />
                </>
              ) : (
                <>
                  <ChartSkeleton title="Balance Trend" />
                  <ChartSkeleton title="Spending by Category" />
                </>
              )}
            </div>
            <div>
              <InsightsSection transactions={transactions} />
            </div>
            <div id="transactions-section" className="mt-8 scroll-mt-24">
              <TransactionList />
            </div>
          </>
        )}
      </main>

      {showBackToTop ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleBackToTop}
          className="fixed right-4 bottom-4 z-30 shadow-md sm:right-6 sm:bottom-6"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  )
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 h-6 w-40 rounded bg-muted/70" aria-hidden="true" />
      <span className="sr-only">{title} chart is loading</span>
      <div className="h-65 animate-pulse rounded-lg bg-muted/50 sm:h-75" />
    </div>
  )
}

export default App
