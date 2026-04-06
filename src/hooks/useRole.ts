import { useContext } from "react"

import { RoleContext, type RoleContextValue } from "@/context/RoleContext"

export default function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext)

  if (ctx == null) {
    throw new Error("useRole must be used within a RoleProvider")
  }

  return ctx
}
