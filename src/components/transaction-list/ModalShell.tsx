import { useEffect, useId, useRef, type ReactNode } from "react"

type ModalShellProps = {
  title: string
  description?: string
  children: ReactNode
  onRequestClose?: () => void
}

export function ModalShell({
  title,
  description,
  children,
  onRequestClose,
}: ModalShellProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const selectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(selectors)
    ).filter((element) => !element.hasAttribute("disabled"))

    focusableElements[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onRequestClose?.()
        return
      }

      if (event.key !== "Tab" || focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    dialog.addEventListener("keydown", handleKeyDown)

    return () => {
      dialog.removeEventListener("keydown", handleKeyDown)
    }
  }, [onRequestClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onRequestClose?.()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-2xl"
      >
        <div className="mb-5 space-y-1">
          <h3 id={titleId} className="text-lg font-medium text-foreground">
            {title}
          </h3>
          {description ? (
            <p
              id={descriptionId}
              className="text-sm text-muted-foreground"
            >
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  )
}
