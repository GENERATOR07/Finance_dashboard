import { format, parseISO, startOfMonth, subMonths } from "date-fns"
import type {
  CategoryTotal,
  MonthlyData,
  Transaction,
} from "@/types/finance"

export function calculateTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome: income,
    totalExpenses: expenses,
    balance: income - expenses,
  }
}

export function getMonthlyData(transactions: Transaction[]): MonthlyData[] {
  const monthMap = new Map<string, { income: number; expenses: number }>()

  transactions.forEach((t) => {
    const monthKey = format(startOfMonth(parseISO(t.date)), "yyyy-MM")
    const current = monthMap.get(monthKey) || { income: 0, expenses: 0 }

    if (t.type === "income") {
      current.income += t.amount
    } else {
      current.expenses += t.amount
    }

    monthMap.set(monthKey, current)
  })

  const currentMonthStart = startOfMonth(new Date())

  return Array.from({ length: 6 }, (_, index) => {
    const monthDate = subMonths(currentMonthStart, 5 - index)
    const monthKey = format(monthDate, "yyyy-MM")
    const data = monthMap.get(monthKey) || { income: 0, expenses: 0 }

    return {
      month: format(monthDate, "MMM yyyy"),
      income: data.income,
      expenses: data.expenses,
      balance: data.income - data.expenses,
    }
  })
}
export function getCategoryTotals(
  transactions: Transaction[]
): CategoryTotal[] {
  const categoryMap = new Map<string, number>()

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const current = categoryMap.get(t.category) || 0
      categoryMap.set(t.category, current + t.amount)
    })

  return Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}
export function getTopCategory(
  transactions: Transaction[]
): { category: string; amount: number } | null {
  const categories = getCategoryTotals(transactions)
  return categories.length > 0
    ? { category: categories[0].category, amount: categories[0].total }
    : null
}

export function getMonthlyComparison(transactions: Transaction[]): {
  current: number
  previous: number
  change: number
} {
  const now = new Date()
  const currentMonth = format(startOfMonth(now), "yyyy-MM")
  const previousMonth = format(
    startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
    "yyyy-MM"
  )

  const currentExpenses = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        format(startOfMonth(parseISO(t.date)), "yyyy-MM") === currentMonth
    )
    .reduce((sum, t) => sum + t.amount, 0)

  const previousExpenses = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        format(startOfMonth(parseISO(t.date)), "yyyy-MM") === previousMonth
    )
    .reduce((sum, t) => sum + t.amount, 0)

  const change =
    previousExpenses > 0
      ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
      : 0

  return { current: currentExpenses, previous: previousExpenses, change }
}
