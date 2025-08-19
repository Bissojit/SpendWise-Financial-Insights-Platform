import { Transaction } from "../types/transaction";
export const sampleData: Transaction[] = [
  { id: "1", description: "Salary", amount: 3500, type: "income", category: "Salary", date: "2025-07-28" },
  { id: "2", description: "Groceries", amount: 120, type: "expense", category: "Food", date: "2025-08-01" },
  { id: "3", description: "Internet bill", amount: 60, type: "expense", category: "Utilities", date: "2025-08-05" },
  { id: "4", description: "Freelance", amount: 400, type: "income", category: "Freelance", date: "2025-08-07" },
  { id: "5", description: "Dinner out", amount: 45, type: "expense", category: "Entertainment", date: "2025-08-08" }
];
