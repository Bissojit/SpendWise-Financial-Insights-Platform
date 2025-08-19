import React, { useMemo } from "react";
import { Transaction } from "../../types/transaction";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4caf50", "#ff9800", "#f44336", "#2196f3", "#9c27b0", "#00bcd4", "#795548"];

const ExpensePie: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    transactions.filter(t => t.type === "expense").forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  if (data.length === 0) return (
    <div className="card chart-card">
      <h3>Spending breakdown</h3>
      <div className="empty">No expenses yet</div>
    </div>
  );

  return (
    <div className="card chart-card">
      <h3>Spending breakdown</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={96} paddingAngle={2} label>
              {data.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v:number) => v.toLocaleString(undefined, { style: "currency", currency: "AUD" })} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensePie;
