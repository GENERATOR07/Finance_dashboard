import { useState } from "react"
import type { Transaction } from "types/finance"
import useFinance from "@/hooks/useFinance"
import { Button } from "@/components/ui/button"
import { ModalShell } from "./ModalShell"
import { createTransactionFormData, toTransactionInput } from "./utils"

type TransactionFormModalProps = {
  onClose: () => void
  transaction?: Transaction
}

export function TransactionFormModal({
  onClose,
  transaction,
}: TransactionFormModalProps) {
  const { addTransaction, updateTransaction } = useFinance()
  const isEditing = transaction != null
  const [formData, setFormData] = useState(createTransactionFormData(transaction))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description || !formData.category || !formData.amount) {
      return
    }

    const input = toTransactionInput(formData)

    if (transaction) {
      updateTransaction(transaction.id, input)
    } else {
      addTransaction(input)
    }

    onClose()
  }

  return (
    <ModalShell
      title={isEditing ? "Edit Transaction" : "Add Transaction"}
      description={
        isEditing
          ? "Update the transaction details and save your changes."
          : "Capture a new transaction for your finance dashboard."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Date">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            required
          />
        </FormField>

        <FormField label="Type">
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
        </FormField>

        <FormField label="Category">
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
        </FormField>

        <FormField label="Description">
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
        </FormField>

        <FormField label="Amount">
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            placeholder="0.00"
            required
          />
        </FormField>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {isEditing ? "Save Changes" : "Add Transaction"}
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-foreground">{label}</label>
      {children}
    </div>
  )
}
