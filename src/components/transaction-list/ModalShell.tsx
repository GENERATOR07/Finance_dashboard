import type { ReactNode } from "react"

type ModalShellProps = {
  title: string
  description?: string
  children: ReactNode
}

export function ModalShell({
  title,
  description,
  children,
}: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl">
        <div className="mb-5 space-y-1">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  )
}
