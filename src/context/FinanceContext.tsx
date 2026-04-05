import { createContext } from "react"
import type { Transaction, UserRole } from "types/finance"

export type FinanceContextValue = {
  transactions: Transaction[]
  userRole: UserRole
  addTransaction: (input: Omit<Transaction, "id">) => void
  deleteTransaction: (id: string) => void
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)
