import { format, parseISO, startOfMonth } from "date-fns"
import type { CategoryTotal, MonthlyData, Transaction } from "../types/finance"

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

  return Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month: format(parseISO(`${month}-01`), "MMM yyyy"),
      income: data.income,
      expenses: data.expenses,
      balance: data.income - data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
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
