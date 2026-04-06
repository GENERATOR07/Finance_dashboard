import { useState } from "react"
import type { Transaction } from "@/types/finance"

import { Button } from "@/components/ui/button"
import useFinance from "@/hooks/useFinance"
import { ModalShell } from "./ModalShell"

type DeleteTransactionModalProps = {
  transaction: Transaction
  onClose: () => void
}

export function DeleteTransactionModal({
  transaction,
  onClose,
}: DeleteTransactionModalProps) {
  const { deleteTransaction, isMutating, error } = useFinance()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleDelete = async () => {
    setSubmitError(null)

    try {
      await deleteTransaction(transaction.id)
      onClose()
    } catch {
      setSubmitError(error ?? "Something went wrong. Please try again.")
    }
  }

  return (
    <ModalShell
      title="Delete Transaction"
      description="This action cannot be undone. The transaction will be removed from the dashboard immediately."
      onRequestClose={isMutating ? undefined : onClose}
    >
      {submitError ? (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      ) : null}

      <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
        <p className="text-sm font-medium text-foreground">
          {transaction.description}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {transaction.category} | {transaction.type} | $
          {transaction.amount.toFixed(2)}
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onClose}
          disabled={isMutating}
        >
          Keep It
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="flex-1"
          onClick={handleDelete}
          disabled={isMutating}
        >
          {isMutating ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </ModalShell>
  )
}
