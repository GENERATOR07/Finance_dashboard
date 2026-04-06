import { createContext } from "react"
import type { Transaction } from "@/types/finance"

export type FinanceContextValue = {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  isMutating: boolean
  addTransaction: (input: Omit<Transaction, "id">) => Promise<void>
  updateTransaction: (
    id: string,
    input: Omit<Transaction, "id">
  ) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)
