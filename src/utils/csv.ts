import { Transaction } from "../types/transaction";
import { v4 as uuidv4 } from "uuid";

// Simple CSV writer (header + rows). Columns: id,description,amount,type,category,date
export function transactionsToCSV(txs: Transaction[]) {
  const header = ["id","description","amount","type","category","date"];
  const rows = txs.map(t => [
    t.id,
    `"${(t.description || "").replace(/"/g,'""')}"`,
    String(t.amount),
    t.type,
    t.category,
    t.date
  ].join(","));
  return [header.join(","), ...rows].join("\n");
}

// Very permissive CSV parser — accepts headered CSV and maps columns.
// Returns Transaction[]; for rows missing id, generate uuid.
export function csvToTransactions(csv: string): Transaction[] {
  const lines = csv.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 1) return [];
  const header = lines[0].split(",").map(h => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);
  const out: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    // naive split, supports quoted description with commas
    const row = parseCSVLine(lines[i]);
    const t: Transaction = {
      id: row[idx("id")] || uuidv4(),
      description: row[idx("description")] ? stripQuotes(row[idx("description")]) : "Imported",
      amount: Number(row[idx("amount")] || 0) || 0,
      type: ((row[idx("type")] || "expense").toLowerCase() === "income") ? "income" : "expense",
      category: row[idx("category")] || "Other",
      date: row[idx("date")] || new Date().toISOString().slice(0,10)
    };
    out.push(t);
  }
  return out;
}

function stripQuotes(s: string) {
  if (!s) return s;
  return s.startsWith('"') && s.endsWith('"') ? s.slice(1,-1).replace(/""/g,'"') : s;
}

// parse CSV line handling quoted fields with commas
function parseCSVLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' ) {
      if (inQuotes && line[i+1] === '"') { cur += '"'; i++; continue; }
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}
