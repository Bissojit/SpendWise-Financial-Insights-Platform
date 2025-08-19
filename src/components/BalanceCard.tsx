import React, { useMemo } from "react";
import { Transaction } from "../types/transaction";
import { format } from "date-fns";

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 2 });

const BalanceCard: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const { balance, income, expense, lastUpdated } = useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return {
      balance: income - expense,
      income,
      expense,
      lastUpdated: transactions[0]?.date ?? new Date().toISOString().slice(0, 10)
    };
  }, [transactions]);

  return (
    <div className="card balance-card">
      <h3>Current Balance</h3>
      <p className="big">{currency(balance)}</p>

      <div className="small-stats">
        <div><span className="muted">Income</span><strong>{currency(income)}</strong></div>
        <div><span className="muted">Expense</span><strong>-{currency(expense)}</strong></div>
      </div>

      <div className="meta">
        <small>Last update: {format(new Date(lastUpdated), "MMM d, yyyy")}</small>
      </div>
    </div>
  );
};

export default BalanceCard;
