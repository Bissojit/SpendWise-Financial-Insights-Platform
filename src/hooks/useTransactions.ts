import { useEffect, useState } from "react";
import { Transaction } from "../types/transaction";
import { loadTransactions, saveTransactions } from "../utils/storage";
import { sampleData } from "../data/sampleData";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const loaded = loadTransactions();
    return loaded.length ? loaded : sampleData;
  });

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const add = (tx: Transaction) => setTransactions(prev => [tx, ...prev]);
  const remove = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));
  const clearAll = () => setTransactions([]);
  const update = (updated: Transaction) =>
    setTransactions(prev => prev.map(t => (t.id === updated.id ? updated : t)));

  return { transactions, add, remove, clearAll, update };
}
