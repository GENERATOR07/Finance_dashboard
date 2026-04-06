import type { Transaction } from "@/types/finance"

import { generateMockTransactions } from "@/utils/mockData"

const FETCH_DELAY_MS = 450
const MUTATION_DELAY_MS = 600

let transactionStore: Transaction[] | null = null

function ensureStore() {
  if (transactionStore == null) {
    transactionStore = generateMockTransactions()
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

  return delay(nextTransaction, MUTATION_DELAY_MS)
}

export async function deleteTransaction(id: string): Promise<void> {
  transactionStore = ensureStore().filter(
    (transaction) => transaction.id !== id
  )
  await delay(undefined, MUTATION_DELAY_MS)
}
