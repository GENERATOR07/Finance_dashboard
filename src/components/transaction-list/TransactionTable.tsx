import { format, parseISO } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import type { Transaction } from "types/finance"
import { Button } from "@/components/ui/button"

type TransactionTableProps = {
  transactions: Transaction[]
  canManageTransactions: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionTable({
  transactions,
  canManageTransactions,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>No transactions found</p>
        <p className="mt-2 text-sm">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr>
            <TableHeadCell align="left">Date</TableHeadCell>
            <TableHeadCell align="left">Description</TableHeadCell>
            <TableHeadCell align="left">Category</TableHeadCell>
            <TableHeadCell align="left">Type</TableHeadCell>
            <TableHeadCell align="right">Amount</TableHeadCell>
            {canManageTransactions ? (
              <TableHeadCell align="right">Actions</TableHeadCell>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-border transition-colors hover:bg-muted/50"
            >
              <TableBodyCell>{format(parseISO(transaction.date), "MMM dd, yyyy")}</TableBodyCell>
              <TableBodyCell>{transaction.description}</TableBodyCell>
              <TableBodyCell>
                <span className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                  {transaction.category}
                </span>
              </TableBodyCell>
              <TableBodyCell>
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    transaction.type === "income"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {transaction.type}
                </span>
              </TableBodyCell>
              <TableBodyCell align="right" emphasized>
                <span
                  className={
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableBodyCell>
              {canManageTransactions ? (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(transaction)}
                      aria-label="Edit transaction"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => onDelete(transaction)}
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TableHeadCell({
  children,
  align,
}: {
  children: React.ReactNode
  align: "left" | "right"
}) {
  return (
    <th
      className={`px-4 py-3 text-muted-foreground ${
        align === "right" ? "text-right" : "text-left"
      }`}
      style={{
        fontSize: "0.875rem",
        fontWeight: "var(--font-weight-medium)",
      }}
    >
      {children}
    </th>
  )
}

function TableBodyCell({
  children,
  align = "left",
  emphasized = false,
}: {
  children: React.ReactNode
  align?: "left" | "right"
  emphasized?: boolean
}) {
  return (
    <td
      className={`px-4 py-3 text-foreground ${
        align === "right" ? "text-right" : "text-left"
      }`}
      style={{
        fontSize: "0.875rem",
        fontWeight: emphasized ? "var(--font-weight-medium)" : undefined,
      }}
    >
      {children}
    </td>
  )
}
