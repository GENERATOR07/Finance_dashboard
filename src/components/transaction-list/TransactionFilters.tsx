import { Search } from "lucide-react"
import type {
  TransactionFilterType,
  TransactionSortBy,
  TransactionSortOrder,
} from "./types"

type TransactionFiltersProps = {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  filterType: TransactionFilterType
  onFilterTypeChange: (value: TransactionFilterType) => void
  filterCategory: string
  onFilterCategoryChange: (value: string) => void
  categories: string[]
  sortBy: TransactionSortBy
  sortOrder: TransactionSortOrder
  onSortChange: (sortBy: TransactionSortBy, sortOrder: TransactionSortOrder) => void
}

export function TransactionFilters({
  searchTerm,
  onSearchTermChange,
  filterType,
  onFilterTypeChange,
  filterCategory,
  onFilterCategoryChange,
  categories,
  sortBy,
  sortOrder,
  onSortChange,
}: TransactionFiltersProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="bg-input-background w-full rounded-lg border border-border py-2 pr-4 pl-10 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        />
      </div>

      <select
        value={filterType}
        onChange={(e) => onFilterTypeChange(e.target.value as TransactionFilterType)}
        className="bg-input-background rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={filterCategory}
        onChange={(e) => onFilterCategoryChange(e.target.value)}
        className="bg-input-background rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={`${sortBy}-${sortOrder}`}
        onChange={(e) => {
          const [nextSortBy, nextSortOrder] = e.target.value.split("-")
          onSortChange(
            nextSortBy as TransactionSortBy,
            nextSortOrder as TransactionSortOrder
          )
        }}
        className="bg-input-background rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
      >
        <option value="date-desc">Date (Newest)</option>
        <option value="date-asc">Date (Oldest)</option>
        <option value="amount-desc">Amount (High to Low)</option>
        <option value="amount-asc">Amount (Low to High)</option>
      </select>
    </div>
  )
}
