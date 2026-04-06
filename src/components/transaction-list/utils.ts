import { format } from "date-fns"
import type { Transaction } from "@/types/finance"
import type {
  TransactionFilterType,
  TransactionFormData,
  TransactionFormInput,
  TransactionSortBy,
  TransactionSortOrder,
} from "./types"

export function createTransactionFormData(
  transaction?: Transaction
): TransactionFormData {
  return {
    date: transaction?.date ?? format(new Date(), "yyyy-MM-dd"),
    description: transaction?.description ?? "",
    category: transaction?.category ?? "",
    type: transaction?.type ?? "expense",
    amount: transaction?.amount != null ? String(transaction.amount) : "",
  }
}

export function filterAndSortTransactions({
  transactions,
  searchTerm,
  filterType,
  filterCategory,
  sortBy,
  sortOrder,
}: {
  transactions: Transaction[]
  searchTerm: string
  filterType: TransactionFilterType
  filterCategory: string
  sortBy: TransactionSortBy
  sortOrder: TransactionSortOrder
}) {
  let result = transactions

  if (searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase()
    result = result.filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(normalizedSearch) ||
        transaction.category.toLowerCase().includes(normalizedSearch)
    )
  }

  if (filterType !== "all") {
    result = result.filter((transaction) => transaction.type === filterType)
  }

  if (filterCategory !== "all") {
    result = result.filter((transaction) => transaction.category === filterCategory)
  }

  return [...result].sort((a, b) => {
    if (sortBy === "date") {
      const comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      return sortOrder === "asc" ? comparison : -comparison
    }

    const comparison = a.amount - b.amount
    return sortOrder === "asc" ? comparison : -comparison
  })
}

export function createTransactionsCsv(transactions: Transaction[]) {
  return [
    ["Date", "Description", "Category", "Type", "Amount"].join(","),
    ...transactions.map((transaction) =>
      [
        transaction.date,
        transaction.description,
        transaction.category,
        transaction.type,
        transaction.amount,
      ].join(",")
    ),
  ].join("\n")
}

export function toTransactionInput(
  formData: TransactionFormData
): TransactionFormInput {
  return {
    date: formData.date,
    description: formData.description,
    category: formData.category,
    type: formData.type,
    amount: parseFloat(formData.amount),
  }
}
