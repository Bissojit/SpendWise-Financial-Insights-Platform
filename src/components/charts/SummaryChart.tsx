import React, { useMemo } from "react";
import { Transaction } from "../../types/transaction";
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { subDays, format, parseISO } from "date-fns";

type Props = { transactions: Transaction[] };

function buildLast30DaysData(txs: Transaction[]) {
  const today = new Date();
  const arr = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(today, 29 - i);
    const key = format(d, "yyyy-MM-dd");
    return { date: key, income: 0, expense: 0 };
  });

  const map = new Map(arr.map(a => [a.date, a]));
  txs.forEach(t => {
    const key = t.date.slice(0, 10);
    const entry = map.get(key);
    if (!entry) return;
    if (t.type === "income") entry.income += t.amount;
    else entry.expense += t.amount;
  });

  return Array.from(map.values()).map(r => ({ ...r, short: format(parseISO(r.date), "dd MMM") }));
}

const SummaryChart: React.FC<Props> = ({ transactions }) => {
  const data = useMemo(() => buildLast30DaysData(transactions), [transactions]);

  return (
    <div className="card chart-card" id="charts">
      <h3>30-day summary</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="short" minTickGap={12} />
            <YAxis />
            <Tooltip formatter={(v: number) => v.toLocaleString(undefined, { style: "currency", currency: "AUD" })} />
            <Bar dataKey="expense" barSize={18} />
            <Line type="monotone" dataKey="income" stroke="#2b8aef" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SummaryChart;
