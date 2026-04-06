import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "@/App"
import { FinanceProvider } from "@/components/finance-provider"
import { RoleProvider } from "@/components/role-provider"
import { ThemeProvider } from "@/components/theme-provider"

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
