import { Transaction } from "../types/transaction";

const KEY = "my_finance_transactions_v1";

export const saveTransactions = (txs: Transaction[]) => {
  localStorage.setItem(KEY, JSON.stringify(txs));
};

export const loadTransactions = (): Transaction[] => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Transaction[];
    return parsed;
  } catch {
    return [];
  }
};
