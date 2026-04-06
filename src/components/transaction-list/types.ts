import type { Transaction, TransactionType } from "types/finance"

export type TransactionFilterType = "all" | TransactionType
export type TransactionSortBy = "date" | "amount"
export type TransactionSortOrder = "asc" | "desc"

export type TransactionFormData = {
  date: string
  description: string
  category: string
  type: TransactionType
  amount: string
}

export type TransactionFormInput = Omit<Transaction, "id">
