import { Moon, Sun, User } from "lucide-react"

import useRole from "@/hooks/useRole"

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
  const { userRole, setUserRole } = useRole()

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
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

        <div className="flex items-center gap-4">
          {/* Role Selector */}
          <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
            <User className="ml-2 h-4 w-4 text-muted-foreground" />
            <button
              onClick={() => setUserRole("viewer")}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                userRole === "viewer"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Viewer
            </button>
            <button
              onClick={() => setUserRole("admin")}
              className={`rounded-md px-3 py-1.5 transition-colors ${
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
