export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number; // positive number
  type: TransactionType;
  category: string;
  date: string; // ISO string
}
