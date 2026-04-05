import { useState, useMemo } from "react"
import { Search, Download, Plus, Trash2 } from "lucide-react"
import useFinance from "@/hooks/useFinance"
import { format, parseISO } from "date-fns"

export function TransactionList() {
  const { transactions, userRole, deleteTransaction } = useFinance()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  )
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showAddModal, setShowAddModal] = useState(false)

  const categories = useMemo(() => {
    const uniqueCategories = new Set(transactions.map((t) => t.category))
    return Array.from(uniqueCategories).sort()
  }, [transactions])

  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType)
    }

    // Filter by category
    if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory)
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "date") {
        const comparison =
          new Date(a.date).getTime() - new Date(b.date).getTime()
        return sortOrder === "asc" ? comparison : -comparison
      } else {
        const comparison = a.amount - b.amount
        return sortOrder === "asc" ? comparison : -comparison
      }
    })

    return result
  }, [transactions, searchTerm, filterType, filterCategory, sortBy, sortOrder])

  const handleExport = () => {
    const csv = [
      ["Date", "Description", "Category", "Type", "Amount"].join(","),
      ...filteredAndSortedTransactions.map((t) =>
        [t.date, t.description, t.category, t.type, t.amount].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-foreground">Transactions</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          {userRole === "admin" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input-background w-full rounded-lg border border-border py-2 pr-4 pl-10 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as "all" | "income" | "expense")
          }
          className="bg-input-background rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-input-background rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split("-")
            setSortBy(by as "date" | "amount")
            setSortOrder(order as "asc" | "desc")
          }}
          className="bg-input-background rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="amount-desc">Amount (High to Low)</option>
          <option value="amount-asc">Amount (Low to High)</option>
        </select>
      </div>

      {/* Transaction List */}
      <div className="overflow-x-auto">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>No transactions found</p>
            <p style={{ fontSize: "0.875rem" }} className="mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th
                  className="px-4 py-3 text-left text-muted-foreground"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Date
                </th>
                <th
                  className="px-4 py-3 text-left text-muted-foreground"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Description
                </th>
                <th
                  className="px-4 py-3 text-left text-muted-foreground"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Category
                </th>
                <th
                  className="px-4 py-3 text-left text-muted-foreground"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Type
                </th>
                <th
                  className="px-4 py-3 text-right text-muted-foreground"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Amount
                </th>
                {userRole === "admin" && (
                  <th
                    className="px-4 py-3 text-right text-muted-foreground"
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border transition-colors hover:bg-muted/50"
                >
                  <td
                    className="px-4 py-3 text-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {format(parseISO(transaction.date), "MMM dd, yyyy")}
                  </td>
                  <td
                    className="px-4 py-3 text-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {transaction.description}
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>
                    <span className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: "0.875rem" }}>
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-right text-foreground"
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  {userRole === "admin" && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="rounded p-1 text-destructive transition-colors hover:bg-destructive/10"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <AddTransactionModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

function AddTransactionModal({ onClose }: { onClose: () => void }) {
  const { addTransaction } = useFinance()
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
    amount: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.description && formData.category && formData.amount) {
      addTransaction({
        date: formData.date,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        amount: parseFloat(formData.amount),
      })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-foreground">Add Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="mb-2 block text-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              className="mb-2 block text-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "income" | "expense",
                })
              }
              className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label
              className="mb-2 block text-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              placeholder="e.g., Groceries, Salary"
              required
            />
          </div>
          <div>
            <label
              className="mb-2 block text-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              placeholder="Brief description"
              required
            />
          </div>
          <div>
            <label
              className="mb-2 block text-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              placeholder="0.00"
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionList
