import { useCallback, useMemo, useState, type ReactNode } from "react"
import type { Transaction } from "../../types/finance"
import { generateMockTransactions } from "../../utils/mockData"
import {
  FinanceContext,
  type FinanceContextValue,
} from "@/context/FinanceContext"

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    generateMockTransactions()
  )

  const addTransaction = useCallback((input: Omit<Transaction, "id">) => {
    const id = `txn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setTransactions((prev) => [...prev, { ...input, id }])
  }, [])

  const updateTransaction = useCallback(
    (id: string, input: Omit<Transaction, "id">) => {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? { ...input, id } : transaction
        )
      )
    },
    []
  )

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(
    (): FinanceContextValue => ({
      transactions,
      userRole: "admin",
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [transactions, addTransaction, updateTransaction, deleteTransaction]
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}
