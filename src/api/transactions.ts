import type { Transaction } from "@/types/finance"

import { generateMockTransactions } from "@/utils/mockData"

const FETCH_DELAY_MS = 300
const MUTATION_DELAY_MS = 400
const TRANSACTIONS_STORAGE_KEY = "finance-dashboard-transactions"

let transactionStore: Transaction[] | null = null

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

function readStoredTransactions(): Transaction[] | null {
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

function writeStoredTransactions(transactions: Transaction[]) {
  window.localStorage.setItem(
    TRANSACTIONS_STORAGE_KEY,
    JSON.stringify(transactions)
  )
}

function ensureStore() {
  if (transactionStore == null) {
    const storedTransactions = readStoredTransactions()
    transactionStore = storedTransactions ?? generateMockTransactions()

    if (storedTransactions == null) {
      writeStoredTransactions(transactionStore)
    }
  }

  return transactionStore
}

function delay<T>(value: T, timeoutMs: number): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), timeoutMs)
  })
}

export async function fetchTransactions(): Promise<Transaction[]> {
  return delay([...ensureStore()], FETCH_DELAY_MS)
}

export async function createTransaction(
  input: Omit<Transaction, "id">
): Promise<Transaction> {
  const transaction = {
    ...input,
    id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  }

  transactionStore = [transaction, ...ensureStore()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  writeStoredTransactions(transactionStore)

  return delay(transaction, MUTATION_DELAY_MS)
}

export async function updateTransaction(
  id: string,
  input: Omit<Transaction, "id">
): Promise<Transaction> {
  const nextTransaction = { ...input, id }

  transactionStore = ensureStore()
    .map((transaction) =>
      transaction.id === id ? nextTransaction : transaction
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  writeStoredTransactions(transactionStore)

  return delay(nextTransaction, MUTATION_DELAY_MS)
}

export async function deleteTransaction(id: string): Promise<void> {
  transactionStore = ensureStore().filter(
    (transaction) => transaction.id !== id
  )
  writeStoredTransactions(transactionStore)
  await delay(undefined, MUTATION_DELAY_MS)
}
