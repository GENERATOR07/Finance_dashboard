import { useId, useState } from "react"
import type { Transaction } from "@/types/finance"

import { Button } from "@/components/ui/button"
import useFinance from "@/hooks/useFinance"
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
  const { addTransaction, updateTransaction, isMutating, error } = useFinance()
  const isEditing = transaction != null
  const [formData, setFormData] = useState(createTransactionFormData(transaction))
  const [submitError, setSubmitError] = useState<string | null>(null)
  const formId = useId()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!formData.description || !formData.category || !formData.amount) {
      return
    }

    try {
      const input = toTransactionInput(formData)

      if (transaction) {
        await updateTransaction(transaction.id, input)
      } else {
        await addTransaction(input)
      }

      onClose()
    } catch {
      setSubmitError(error ?? "Something went wrong. Please try again.")
    }
  }

  return (
    <ModalShell
      title={isEditing ? "Edit Transaction" : "Add Transaction"}
      description={
        isEditing
          ? "Update the transaction details and save your changes."
          : "Capture a new transaction for your finance dashboard."
      }
      onRequestClose={isMutating ? undefined : onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}

        <FormField label="Date" controlId={`${formId}-date`}>
          <input
            id={`${formId}-date`}
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            disabled={isMutating}
            required
          />
        </FormField>

        <FormField label="Type" controlId={`${formId}-type`}>
          <select
            id={`${formId}-type`}
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "income" | "expense",
              })
            }
            className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none dark:bg-card dark:text-foreground"
            disabled={isMutating}
          >
            <option value="expense" className="bg-card text-foreground">
              Expense
            </option>
            <option value="income" className="bg-card text-foreground">
              Income
            </option>
          </select>
        </FormField>

        <FormField label="Category" controlId={`${formId}-category`}>
          <input
            id={`${formId}-category`}
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            placeholder="e.g., Groceries, Salary"
            disabled={isMutating}
            required
          />
        </FormField>

        <FormField label="Description" controlId={`${formId}-description`}>
          <input
            id={`${formId}-description`}
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            placeholder="Brief description"
            disabled={isMutating}
            required
          />
        </FormField>

        <FormField label="Amount" controlId={`${formId}-amount`}>
          <input
            id={`${formId}-amount`}
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="bg-input-background w-full rounded-lg border border-border px-4 py-2 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            placeholder="0.00"
            disabled={isMutating}
            required
          />
        </FormField>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isMutating}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isMutating}>
            {isMutating
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
                ? "Save Changes"
                : "Add Transaction"}
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}

function FormField({
  label,
  controlId,
  children,
}: {
  label: string
  controlId: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={controlId} className="mb-2 block text-sm text-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
