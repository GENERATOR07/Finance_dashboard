import type { Transaction } from "types/finance"
import useFinance from "@/hooks/useFinance"
import { Button } from "@/components/ui/button"
import { ModalShell } from "./ModalShell"

type DeleteTransactionModalProps = {
  transaction: Transaction
  onClose: () => void
}

export function DeleteTransactionModal({
  transaction,
  onClose,
}: DeleteTransactionModalProps) {
  const { deleteTransaction } = useFinance()

  const handleDelete = () => {
    deleteTransaction(transaction.id)
    onClose()
  }

  return (
    <ModalShell
      title="Delete Transaction"
      description="This action cannot be undone. The transaction will be removed from the dashboard immediately."
    >
      <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
        <p className="text-sm font-medium text-foreground">{transaction.description}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {transaction.category} • {transaction.type} • ${transaction.amount.toFixed(2)}
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Keep It
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="flex-1"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </ModalShell>
  )
}
