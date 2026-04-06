import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "@/App"
import { FinanceProvider } from "@/providers/finance-provider"
import { RoleProvider } from "@/providers/role-provider"
import { ThemeProvider } from "@/providers/theme-provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RoleProvider>
        <FinanceProvider>
          <App />
        </FinanceProvider>
      </RoleProvider>
    </ThemeProvider>
  </StrictMode>
)
