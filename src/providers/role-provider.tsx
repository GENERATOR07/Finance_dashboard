import { useMemo, useState, type ReactNode } from "react"

import { RoleContext, type RoleContextValue } from "@/context/RoleContext"
import type { UserRole } from "@/types/finance"

export function RoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("admin")

  const value = useMemo(
    (): RoleContextValue => ({
      userRole,
      setUserRole,
    }),
    [userRole]
  )

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}
