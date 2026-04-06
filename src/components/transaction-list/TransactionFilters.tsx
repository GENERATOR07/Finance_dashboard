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
        className="bg-input-background rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none dark:bg-card dark:text-foreground"
      >
        <option value="all" className="bg-card text-foreground">
          All Types
        </option>
        <option value="income" className="bg-card text-foreground">
          Income
        </option>
        <option value="expense" className="bg-card text-foreground">
          Expense
        </option>
      </select>

      <select
        value={filterCategory}
        onChange={(e) => onFilterCategoryChange(e.target.value)}
        className="bg-input-background rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none dark:bg-card dark:text-foreground"
      >
        <option value="all" className="bg-card text-foreground">
          All Categories
        </option>
        {categories.map((category) => (
          <option key={category} value={category} className="bg-card text-foreground">
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
        className="bg-input-background rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none dark:bg-card dark:text-foreground"
      >
        <option value="date-desc" className="bg-card text-foreground">
          Date (Newest)
        </option>
        <option value="date-asc" className="bg-card text-foreground">
          Date (Oldest)
        </option>
        <option value="amount-desc" className="bg-card text-foreground">
          Amount (High to Low)
        </option>
        <option value="amount-asc" className="bg-card text-foreground">
          Amount (Low to High)
        </option>
      </select>
    </div>
  )
}
