import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../types/transaction";

const categories = ["Food", "Utilities", "Transport", "Entertainment", "Salary", "Freelance", "Other"];

type Props = {
  onAdd: (tx: Transaction) => void;
  editing?: Transaction | null;
  onUpdate?: (tx: Transaction) => void;
  onCancelEdit?: () => void;
};

const AddTransactionForm: React.FC<Props> = ({ onAdd, editing, onUpdate, onCancelEdit }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (editing) {
      setDescription(editing.description);
      setAmount(editing.amount);
      setType(editing.type);
      setCategory(editing.category);
      setDate(editing.date.slice(0,10));
    } else {
      setDescription("");
      setAmount("");
      setType("expense");
      setCategory("Other");
      setDate(new Date().toISOString().slice(0,10));
    }
  }, [editing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) {
      alert("Please enter a valid description and positive amount.");
      return;
    }
    if (editing && onUpdate) {
      onUpdate({ ...editing, description: description.trim(), amount: Number(amount), type, category, date });
      return;
    }
    const tx: Transaction = { id: uuidv4(), description: description.trim(), amount: Number(amount), type, category, date };
    onAdd(tx);
    // reset
    setDescription(""); setAmount(""); setType("expense"); setCategory("Other"); setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <form className="card add-form" onSubmit={handleSubmit}>
      <h3>{editing ? "Edit transaction" : "Add transaction"}</h3>
      <div className="form-row">
        <label>Description
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Coffee, Salary" />
        </label>

        <label>Amount
          <input type="number" value={amount} onChange={e => setAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0.00" step="0.01" />
        </label>
      </div>

      <div className="form-row">
        <label>Type
          <select value={type} onChange={e => setType(e.target.value as any)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label>Category
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>Date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
      </div>

      <div className="form-actions">
        {editing && <button type="button" className="btn ghost" onClick={() => onCancelEdit?.()}>Cancel</button>}
        <button className={`btn ${editing ? "primary" : "primary"}`} type="submit">{editing ? "Save" : "Add"}</button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
