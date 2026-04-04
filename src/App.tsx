import BalanceTrendChart from "./components/BalanceTrendChart"
import CategoryBreakDownChart from "./components/CategoryBreakDownChart"
import InsightsSection from "./components/InsightsSection"
import SummaryCard from "./components/SummaryCard"

import TransactionList from "./components/TransactionList"

export function App() {
  return (
    <div className="flex min-h-screen">
      <header></header>
      <main>
        <div className="flex">
          <SummaryCard />
          <SummaryCard />
          <SummaryCard />
        </div>
        <div>
          <BalanceTrendChart />
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
