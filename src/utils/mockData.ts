import type { Transaction } from "@/types/finance"

const categories = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Bonus"],
  expense: [
    "Groceries",
    "Rent",
    "Utilities",
    "Transportation",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Food & Dining",
    "Education",
    "Insurance",
  ],
}

const descriptions = {
  income: {
    Salary: "Monthly salary payment",
    Freelance: "Freelance project payment",
    Investment: "Investment returns",
    Gift: "Gift received",
    Bonus: "Performance bonus",
  },
  expense: {
    Groceries: "Supermarket shopping",
    Rent: "Monthly rent payment",
    Utilities: "Electricity and water bill",
    Transportation: "Gas and public transport",
    Entertainment: "Movie tickets",
    Healthcare: "Medical checkup",
    Shopping: "Online shopping",
    "Food & Dining": "Restaurant meal",
    Education: "Online course",
    Insurance: "Health insurance premium",
  },
}

export function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = []
  const now = new Date()

  // Generate transactions for the last 6 months
  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const month = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)

    // Add 2-3 income transactions per month
    const incomeCount = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < incomeCount; i++) {
      const category =
        categories.income[Math.floor(Math.random() * categories.income.length)]
      const day = Math.floor(Math.random() * 28) + 1
      const date = new Date(month.getFullYear(), month.getMonth(), day)

      transactions.push({
        id: `txn-${date.getTime()}-${i}-income`,
        date: date.toISOString().split("T")[0],
        amount:
          category === "Salary"
            ? 5000 + Math.random() * 2000
            : 100 + Math.random() * 500,
        category,
        type: "income",
        description:
          descriptions.income[category as keyof typeof descriptions.income],
      })
    }

    // Add 8-15 expense transactions per month
    const expenseCount = 8 + Math.floor(Math.random() * 8)
    for (let i = 0; i < expenseCount; i++) {
      const category =
        categories.expense[
          Math.floor(Math.random() * categories.expense.length)
        ]
      const day = Math.floor(Math.random() * 28) + 1
      const date = new Date(month.getFullYear(), month.getMonth(), day)

      let amount: number
      if (category === "Rent") {
        amount = 1200 + Math.random() * 300
      } else if (category === "Utilities" || category === "Insurance") {
        amount = 80 + Math.random() * 120
      } else {
        amount = 20 + Math.random() * 150
      }

      transactions.push({
        id: `txn-${date.getTime()}-${i}-expense`,
        date: date.toISOString().split("T")[0],
        amount,
        category,
        type: "expense",
        description:
          descriptions.expense[category as keyof typeof descriptions.expense],
      })
    }
  }

  return transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
