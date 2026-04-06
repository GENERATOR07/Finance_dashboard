import { format, parseISO } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import type { Transaction } from "@/types/finance"

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
    <>
      <div className="space-y-4 md:hidden">
        {transactions.map((transaction) => (
          <MobileTransactionCard
            key={transaction.id}
            transaction={transaction}
            canManageTransactions={canManageTransactions}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-180">
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
                <TableBodyCell>
                  {format(parseISO(transaction.date), "MMM dd, yyyy")}
                </TableBodyCell>
                <TableBodyCell>{transaction.description}</TableBodyCell>
                <TableBodyCell>
                  <span className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                    {transaction.category}
                  </span>
                </TableBodyCell>
                <TableBodyCell>
                  <TransactionTypeBadge type={transaction.type} />
                </TableBodyCell>
                <TableBodyCell align="right" emphasized>
                  <TransactionAmount
                    amount={transaction.amount}
                    type={transaction.type}
                  />
                </TableBodyCell>
                {canManageTransactions ? (
                  <td className="px-4 py-3 text-right">
                    <TransactionActions
                      transaction={transaction}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function MobileTransactionCard({
  transaction,
  canManageTransactions,
  onEdit,
  onDelete,
}: {
  transaction: Transaction
  canManageTransactions: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium text-foreground">
            {transaction.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(transaction.date), "MMM dd, yyyy")}
          </p>
        </div>
        <TransactionAmount amount={transaction.amount} type={transaction.type} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
          {transaction.category}
        </span>
        <TransactionTypeBadge type={transaction.type} />
      </div>

      {canManageTransactions ? (
        <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
          <TransactionActions
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ) : null}
    </div>
  )
}

function TransactionActions({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}) {
  return (
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
  )
}

function TransactionTypeBadge({
  type,
}: {
  type: Transaction["type"]
}) {
  return (
    <span
      className={`rounded px-2 py-1 text-xs ${
        type === "income"
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {type}
    </span>
  )
}

function TransactionAmount({
  amount,
  type,
}: {
  amount: number
  type: Transaction["type"]
}) {
  return (
    <span
      className={`text-sm font-medium ${
        type === "income" ? "text-green-600" : "text-red-600"
      }`}
    >
      {type === "income" ? "+" : "-"}$
      {amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
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
