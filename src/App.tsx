import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import CategoriseSpending from "./components/CategoriseSpending";
import "./styles/global.css";

/* Types */

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  currency: string;
}

interface PieDataItem {
  name: string;
  value: number;
}

/* Constants */

const COLORS = [
  "#8A2BE2", "#A52A2A", "#FFD700", "#FF7F50", "#20B2AA",
  "#FF69B4", "#6495ED", "#DC143C", "#4CAF50", "#F44336",
  "#FF8C00", "#2E8B57", "#BA55D3", "#00CED1", "#CD5C5C",
  "#1E90FF", "#ADFF2F", "#B8860B", "#FF1493", "#708090",
];

const CURRENCIES = ["US($)", "AU($)", "EURO(€)", "GBP(£)", "INR(₹)", "JPY(¥)"];

/* Component */

export default function App() {
  /* State */

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [currency, setCurrency] = useState("US($)");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");

  // Kept intentionally to preserve original logic
  const [isExportingPDF] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  /* Effects */

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  /* Derived Values */

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const pieData: PieDataItem[] = filteredTransactions.reduce<PieDataItem[]>(
    (acc, transaction) => {
      const existing = acc.find(
        (item) => item.name === transaction.description
      );

      if (existing) {
        existing.value += transaction.amount;
      } else {
        acc.push({
          name: transaction.description,
          value: transaction.amount,
        });
      }

      return acc;
    },
    []
  );

  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
  ];

  /* Handlers */

  const handleAddTransaction = () => {
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      description,
      amount: parseFloat(amount),
      currency,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setDescription("");
    setAmount("");
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all transactions?"
    );

    if (confirmed) {
      setTransactions([]);
      localStorage.removeItem("transactions");
    }
  };

  const startEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditDescription(transaction.description);
    setEditAmount(transaction.amount.toString());
  };

  const saveEdit = (id: string) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              description: editDescription,
              amount: parseFloat(editAmount),
            }
          : transaction
      )
    );

    setEditingId(null);
    setEditDescription("");
    setEditAmount("");
  };

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    if (!element) return;

    const formSection = element.querySelector(
      ".form-section"
    ) as HTMLElement | null;

    const editButtons = element.querySelectorAll(
      ".edit-btn"
    ) as NodeListOf<HTMLElement>;

    if (formSection) formSection.style.display = "none";
    editButtons.forEach((btn) => (btn.style.display = "none"));

    element.classList.add("pdf-export");

    html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("finance-tracker.pdf");

      if (formSection) formSection.style.display = "";
      editButtons.forEach((btn) => (btn.style.display = ""));
      element.classList.remove("pdf-export");
    });
  };

  const formatCurrency = (value: number, cur: string) =>
    `${cur}${value.toFixed(2)}`;

  /* Render */

  return (
    <div className="app-container">
      <motion.h1
        className="app-title"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        SpendWise - Financial Insights Platform
      </motion.h1>

      {/* Top Controls */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <motion.button
          className="pdf-btn"
          whileHover={{ scale: 1.05 }}
          onClick={handleDownloadPDF}
        >
          Download as PDF
        </motion.button>

        <motion.button
          className="clear-btn"
          whileHover={{ scale: 1.05 }}
          onClick={handleClearAll}
        >
          Clear All
        </motion.button>
      </div>

      <div ref={pdfRef}>
        {/* Balance Card */}
        <div className="balance-card">
          <h2>Balance: {formatCurrency(balance, currency)}</h2>
          <p>Income: {formatCurrency(totalIncome, currency)}</p>
          <p>Expense: {formatCurrency(totalExpense, currency)}</p>
        </div>

        {/* Input Form */}
        <div className="input-section form-section">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "income" | "expense")
            }
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <motion.button whileHover={{ scale: 1.05 }} onClick={handleAddTransaction}>
            Add
          </motion.button>
        </div>

        {/* Charts */}
        <div className="charts-container">
          <div className="chart-box">
            <h2>Category Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} outerRadius={80} dataKey="value" label>
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h2>Spending Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount">
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "Income" ? "#22c55e" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categorised Spending */}
        <CategoriseSpending transactions={transactions} />

        {/* Transaction List */}
        <div className="transaction-list">
          <h2>Transactions</h2>

          {filteredTransactions.length === 0 && <p>No transactions yet.</p>}

          <ul>
            {filteredTransactions.map((transaction) => (
              <li key={transaction.id} className={transaction.type}>
                {editingId === transaction.id ? (
                  <>
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                    />

                    {!isExportingPDF && (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => saveEdit(transaction.id)}
                        >
                          Save
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {transaction.description} -{" "}
                    {formatCurrency(transaction.amount, transaction.currency)}

                    {!isExportingPDF && (
                      <button
                        className="edit-btn"
                        onClick={() => startEditing(transaction)}
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
