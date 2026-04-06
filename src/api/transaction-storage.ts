import type { Transaction } from "@/types/finance"

const TRANSACTIONS_STORAGE_KEY = "finance-dashboard-transactions"

function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === "string" &&
    typeof candidate.date === "string" &&
    typeof candidate.amount === "number" &&
    typeof candidate.category === "string" &&
    (candidate.type === "income" || candidate.type === "expense") &&
    typeof candidate.description === "string"
  )
}

export function readStoredTransactions(): Transaction[] | null {
  const rawValue = window.localStorage.getItem(TRANSACTIONS_STORAGE_KEY)

  if (rawValue == null) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue) || !parsedValue.every(isTransaction)) {
      return null
    }

    return parsedValue
  } catch {
    return null
  }
}

export function writeStoredTransactions(transactions: Transaction[]) {
  window.localStorage.setItem(
    TRANSACTIONS_STORAGE_KEY,
    JSON.stringify(transactions)
  )
}
