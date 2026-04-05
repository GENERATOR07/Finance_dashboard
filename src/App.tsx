import { BalanceTrendChart } from "./components/BalanceTrendChart"
import CategoryBreakDownChart from "./components/CategoryBreakDownChart"
import InsightsSection from "./components/InsightsSection"
import SummaryCard from "./components/SummaryCard"
import { generateMockTransactions } from "../utils/mockData"
import { calculateTotals } from "../utils/calculations"
import TransactionList from "./components/TransactionList"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useTheme } from "./components/theme-provider"
import Header from "./components/Header"
const tansactions = generateMockTransactions()
const total = calculateTotals(tansactions)
export function App() {
  const { theme, setTheme } = useTheme()
  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  return (
    <div className="min-h-screen">
      <Header darkMode={theme === "dark"} toggleDarkMode={handleClick} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
        <div>
          <BalanceTrendChart darkMode={theme === "dark"} />
          <CategoryBreakDownChart />
        </div>
        <div>
          <InsightsSection />
        </div>

        <TransactionList />
      </main>
    </div>
  )
}

export default App
