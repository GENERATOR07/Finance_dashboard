import { useMemo, useState } from "react"
import { Download, Plus } from "lucide-react"
import type { Transaction } from "@/types/finance"

import { Button } from "@/components/ui/button"
import useFinance from "@/hooks/useFinance"
import useRole from "@/hooks/useRole"
import { DeleteTransactionModal } from "./transaction-list/DeleteTransactionModal"
import { TransactionFilters } from "./transaction-list/TransactionFilters"
import { TransactionFormModal } from "./transaction-list/TransactionFormModal"
import { TransactionTable } from "./transaction-list/TransactionTable"
import type {
  TransactionFilterType,
  TransactionSortBy,
  TransactionSortOrder,
} from "./transaction-list/types"
import {
  createTransactionsCsv,
  filterAndSortTransactions,
} from "./transaction-list/utils"

export function TransactionList() {
  const { transactions } = useFinance()
  const { userRole } = useRole()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<TransactionFilterType>("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState<TransactionSortBy>("date")
  const [sortOrder, setSortOrder] = useState<TransactionSortOrder>("desc")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [transactionPendingDelete, setTransactionPendingDelete] =
    useState<Transaction | null>(null)

  const categories = useMemo(() => {
    const uniqueCategories = new Set(transactions.map((transaction) => transaction.category))
    return Array.from(uniqueCategories).sort()
  }, [transactions])

  const filteredTransactions = useMemo(
    () =>
      filterAndSortTransactions({
        transactions,
        searchTerm,
        filterType,
        filterCategory,
        sortBy,
        sortOrder,
      }),
    [transactions, searchTerm, filterType, filterCategory, sortBy, sortOrder]
  )

  const handleExport = () => {
    const csv = createTransactionsCsv(filteredTransactions)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const canManageTransactions = userRole === "admin"

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-foreground">Transactions</h3>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          {canManageTransactions ? (
            <Button type="button" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          ) : null}
        </div>
      </div>

      <TransactionFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        categories={categories}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(nextSortBy, nextSortOrder) => {
          setSortBy(nextSortBy)
          setSortOrder(nextSortOrder)
        }}
      />

      <TransactionTable
        transactions={filteredTransactions}
        canManageTransactions={canManageTransactions}
        onEdit={setEditingTransaction}
        onDelete={setTransactionPendingDelete}
      />

      {showAddModal ? (
        <TransactionFormModal onClose={() => setShowAddModal(false)} />
      ) : null}

      {editingTransaction ? (
        <TransactionFormModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      ) : null}

      {transactionPendingDelete ? (
        <DeleteTransactionModal
          transaction={transactionPendingDelete}
          onClose={() => setTransactionPendingDelete(null)}
        />
      ) : null}
    </div>
  )
}

export default TransactionList
