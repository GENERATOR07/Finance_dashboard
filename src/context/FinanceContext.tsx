import { createContext } from "react"
import type { Transaction } from "types/finance"

export type FinanceContextValue = {
  transactions: Transaction[]
  addTransaction: (input: Omit<Transaction, "id">) => void
  updateTransaction: (
    id: string,
    input: Omit<Transaction, "id">
  ) => void
  deleteTransaction: (id: string) => void
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)
