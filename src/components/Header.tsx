import { Moon, Sun, User } from "lucide-react"

import useRole from "@/hooks/useRole"

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
  const { userRole, setUserRole } = useRole()
  const handleJumpToTransactions = () => {
    document
      .getElementById("transactions-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6 sm:py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="min-w-0">
          <h1 className="text-foreground">Finance Dashboard</h1>
          <p
            className="mt-1 text-muted-foreground"
            style={{
              fontSize: "0.875rem",
              fontWeight: "var(--font-weight-normal)",
            }}
          >
            Track and manage your financial activities
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 self-end sm:gap-3 lg:self-auto">
          <button
            onClick={handleJumpToTransactions}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            Transactions
          </button>

          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 p-1">
            <User className="ml-1 h-4 w-4 text-muted-foreground" />
            <button
              onClick={() => setUserRole("viewer")}
              className={`rounded-md px-2 py-1 text-sm transition-colors ${
                userRole === "viewer"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Viewer
            </button>
            <button
              onClick={() => setUserRole("admin")}
              className={`rounded-md px-2 py-1 text-sm transition-colors ${
                userRole === "admin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-lg bg-muted p-2 transition-colors hover:bg-accent"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
