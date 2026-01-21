import { useMemo, useState } from "react";

/* types */

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  currency: string;
}

interface CategoriseSpendingProps {
  transactions: Transaction[];
}

/* Category Rules */

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Transport: ["bus", "train", "uber", "taxi", "metro", "fuel"],
  Food: ["restaurant", "food", "cafe", "coffee", "pizza", "burger"],
  Groceries: ["grocery", "supermarket", "woolworths", "coles", "aldi"],
  Entertainment: ["movie", "cinema", "netflix", "game", "concert"],
  Utilities: ["electricity", "water", "internet", "gas", "rent"],
};

/*Helpers*/

const getCategory = (description: string): string => {
  const lower = description.toLowerCase();

  for (const category in CATEGORY_KEYWORDS) {
    if (CATEGORY_KEYWORDS[category].some(keyword => lower.includes(keyword))) {
      return category;
    }
  }

  return "Others";
};

/*Component*/

export default function CategoriseSpending({
  transactions,
}: CategoriseSpendingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categorisedExpenses = useMemo(() => {
    const result: Record<string, Transaction[]> = {};

    transactions
      .filter(t => t.type === "expense")
      .forEach(transaction => {
        const category = getCategory(transaction.description);

        if (!result[category]) {
          result[category] = [];
        }

        result[category].push(transaction);
      });

    return result;
  }, [transactions]);

  const hasExpenses = Object.keys(categorisedExpenses).length > 0;

  if (!hasExpenses) {
    return (
      <div className="category-box">
        <h2>Categorised Spending</h2>
        <p>No expenses have been made.</p>
      </div>
    );
  }

  return (
    <div className="category-box">
      <h2>Categorised Spending</h2>

      {/* Category Buttons */}
      <div className="category-buttons">
        {Object.keys(categorisedExpenses).map(category => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category ? null : category
              )
            }
          >
            {category} ({categorisedExpenses[category].length})
          </button>
        ))}
      </div>

      {/* Category Details */}
      {selectedCategory && (
        <div className="category-details">
          <h3>{selectedCategory} Expenses</h3>
          <ul>
            {categorisedExpenses[selectedCategory].map(expense => (
              <li key={expense.id}>
                {expense.description} — {expense.currency}
                {expense.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
