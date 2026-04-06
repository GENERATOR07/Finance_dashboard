import { useEffect, useMemo, useState } from "react"
import { ArrowUp, TrendingDown, TrendingUp, Wallet } from "lucide-react"

import { BalanceTrendChart } from "@/components/BalanceTrendChart"
import CategoryBreakdownChart from "@/components/CategoryBreakDownChart"
import Header from "@/components/Header"
import InsightsSection from "@/components/InsightsSection"
import SummaryCard from "@/components/SummaryCard"
import { useTheme } from "@/components/theme-provider"
import TransactionList from "@/components/TransactionList"
import useFinance from "@/hooks/useFinance"
import { Button } from "@/components/ui/button"
import {
  calculateTotals,
  getCategoryTotals,
  getMonthlyData,
} from "../utils/calculations"

export function App() {
  const { transactions, isLoading, error } = useFinance()
  const [showBackToTop, setShowBackToTop] = useState(false)
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
              <BalanceTrendChart
                data={monthlyData}
                darkMode={theme === "dark"}
              />
              <CategoryBreakdownChart
                data={categoryTotals}
                darkMode={theme === "dark"}
              />
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

export default App
