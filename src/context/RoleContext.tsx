import { createContext } from "react"
import type { UserRole } from "types/finance"

export type RoleContextValue = {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
}

export const RoleContext = createContext<RoleContextValue | null>(null)
