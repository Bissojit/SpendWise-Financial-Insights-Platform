import React from "react";
import { Transaction } from "../types/transaction";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 2 });

const TransactionsList: React.FC<{
  transactions: Transaction[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onEdit: (tx: Transaction) => void;
}> = ({ transactions, onRemove, onClear, onEdit }) => {

  return (
    <div className="card transactions" id="transactions">
      <div className="list-header">
        <h3>Transactions</h3>
        <div>
          <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(JSON.stringify(transactions)).then(()=>alert("Copied sample JSON")).catch(()=>alert("Could not copy"))}>Export JSON</button>
          <button className="btn danger" onClick={() => { if(confirm("Clear all transactions?")) onClear(); }}>Clear</button>
        </div>
      </div>

      <div className="list-body">
        <AnimatePresence>
          {transactions.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty">No transactions yet</motion.div>
          )}
          {transactions.map(tx => (
            <motion.div key={tx.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="tx-row">
              <div className="tx-main">
                <div className="tx-desc">{tx.description}</div>
                <div className="tx-meta">{tx.category} • {format(new Date(tx.date), "dd MMM")}</div>
              </div>
              <div className="tx-right">
                <div className={`tx-amount ${tx.type === "income" ? "income" : "expense"}`}>
                  {tx.type === "expense" ? "-" : ""}{currency(tx.amount)}
                </div>
                <div className="tx-actions">
                  <button title="Edit" className="btn small" onClick={() => onEdit(tx)}>Edit</button>
                  <button title="Delete" className="btn small" onClick={() => { if (confirm("Delete this transaction?")) onRemove(tx.id); }}>Delete</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransactionsList;
