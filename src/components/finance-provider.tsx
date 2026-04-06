import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  createTransaction,
  deleteTransaction as deleteTransactionRequest,
  fetchTransactions,
  updateTransaction as updateTransactionRequest,
} from "@/api/transactions"
import {
  FinanceContext,
  type FinanceContextValue,
} from "@/context/FinanceContext"
import type { Transaction } from "types/finance"

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadTransactions() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchTransactions()

        if (!isMounted) {
          return
        }

        setTransactions(data)
      } catch {
        if (!isMounted) {
          return
        }

        setError("Unable to load transactions.")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadTransactions()

    return () => {
      isMounted = false
    }
  }, [])

  const addTransaction = useCallback(async (input: Omit<Transaction, "id">) => {
    setIsMutating(true)
    setError(null)

    try {
      const transaction = await createTransaction(input)
      setTransactions((prev) =>
        [transaction, ...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      )
    } catch {
      setError("Unable to add transaction.")
      throw new Error("Unable to add transaction.")
    } finally {
      setIsMutating(false)
    }
  }, [])

  const updateTransaction = useCallback(
    async (id: string, input: Omit<Transaction, "id">) => {
      setIsMutating(true)
      setError(null)

      try {
        const transaction = await updateTransactionRequest(id, input)
        setTransactions((prev) =>
          prev
            .map((item) => (item.id === id ? transaction : item))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        )
      } catch {
        setError("Unable to update transaction.")
        throw new Error("Unable to update transaction.")
      } finally {
        setIsMutating(false)
      }
    },
    []
  )

  const deleteTransaction = useCallback(async (id: string) => {
    setIsMutating(true)
    setError(null)

    try {
      await deleteTransactionRequest(id)
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
    } catch {
      setError("Unable to delete transaction.")
      throw new Error("Unable to delete transaction.")
    } finally {
      setIsMutating(false)
    }
  }, [])

  const value = useMemo(
    (): FinanceContextValue => ({
      transactions,
      isLoading,
      isMutating,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [
      transactions,
      isLoading,
      isMutating,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    ]
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}
