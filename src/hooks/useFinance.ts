import {
  FinanceContext,
  type FinanceContextValue,
} from "@/context/FinanceContext"
import { useContext } from "react"

export default function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext)
  if (ctx == null) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return ctx
}
