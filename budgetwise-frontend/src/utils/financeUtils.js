/**
 * ============================
 * FINANCIAL ANALYTICS UTILITIES
 * Frontend-only (Milestone 4)
 * ============================
 */

/**
 * ----------------------------------
 * 1. GROUP EXPENSES BY MONTH (LEGACY)
 * Used for expense-only regression
 * ----------------------------------
 */
export function groupExpensesByMonth(expenses) {
  const map = {};

  expenses.forEach((tx) => {
    if (!tx?.date || !tx?.amount || tx.type !== "EXPENSE") return;

    const monthKey = tx.date.slice(0, 7); // YYYY-MM
    map[monthKey] = (map[monthKey] || 0) + Number(tx.amount);
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month,
      total: Math.round(total),
    }));
}

/**
 * ----------------------------------
 * 2. GROUP TRANSACTIONS BY MONTH
 * Income + Expense (NEW)
 * ----------------------------------
 */
export function groupByMonthIncomeExpense(transactions) {
  const map = {};

  transactions.forEach((tx) => {
    if (!tx?.date || !tx?.amount || !tx?.type) return;

    const month = tx.date.slice(0, 7);

    if (!map[month]) {
      map[month] = { month, income: 0, expense: 0 };
    }

    if (tx.type === "INCOME") {
      map[month].income += Number(tx.amount);
    } else if (tx.type === "EXPENSE") {
      map[month].expense += Number(tx.amount);
    }
  });

  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => ({
      month: m.month,
      income: Math.round(m.income),
      expense: Math.round(m.expense),
    }));
}

/**
 * ----------------------------------
 * 3. SIMPLE LINEAR REGRESSION
 * Predict next month's EXPENSE only
 * ----------------------------------
 */
export function predictNextMonthSpending(monthlyData) {
  if (!monthlyData || monthlyData.length < 2) return null;

  const x = monthlyData.map((_, i) => i + 1);
  const y = monthlyData.map((d) => d.total);

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const nextX = n + 1;
  const prediction = slope * nextX + intercept;

  return Math.max(0, Math.round(prediction));
}

/**
 * ----------------------------------
 * 4. SPENDING ALERTS (RULE-BASED)
 * Expense trend alerts
 * ----------------------------------
 */
export function generateSpendingAlerts(monthlyData) {
  const alerts = [];
  if (!monthlyData || monthlyData.length < 2) return alerts;

  const lastMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];

  const diff = lastMonth.total - prevMonth.total;
  const percentChange = (diff / prevMonth.total) * 100;

  if (percentChange > 20) {
    alerts.push(
      `Spending increased by ${percentChange.toFixed(
        1
      )}% compared to last month.`
    );
  }

  if (percentChange < -15) {
    alerts.push(
      `Good improvement! Spending decreased by ${Math.abs(
        percentChange
      ).toFixed(1)}% compared to last month.`
    );
  }

  const avg =
    monthlyData.reduce((sum, d) => sum + d.total, 0) /
    monthlyData.length;

  if (lastMonth.total > avg * 1.3) {
    alerts.push(
      "This month’s spending is significantly higher than your usual average."
    );
  }

  if (lastMonth.total < avg * 0.7) {
    alerts.push(
      "This month’s spending is well below your average. Keep it up!"
    );
  }

  return alerts;
}

/**
 * ----------------------------------
 * 5. SMART SUGGESTIONS
 * Human-readable advice
 * ----------------------------------
 */
export function generateSmartSuggestions(monthlyData, prediction) {
  const suggestions = [];
  if (!monthlyData || monthlyData.length === 0) return suggestions;

  const last = monthlyData[monthlyData.length - 1].total;

  if (prediction && prediction > last * 1.15) {
    suggestions.push(
      "Your spending is projected to increase next month. Consider reviewing discretionary expenses early."
    );
  }

  if (prediction && prediction < last * 0.9) {
    suggestions.push(
      "Your predicted spending is lower than last month. This is a good opportunity to increase savings."
    );
  }

  if (monthlyData.length >= 3) {
    const recent = monthlyData.slice(-3).map((d) => d.total);
    const isIncreasing =
      recent[2] > recent[1] && recent[1] > recent[0];

    if (isIncreasing) {
      suggestions.push(
        "Spending has been rising for the last few months. Setting stricter category budgets may help control expenses."
      );
    }
  }

  suggestions.push(
    "Review non-essential categories and try setting weekly spending limits."
  );

  suggestions.push(
    "Tracking expenses daily can help identify unnecessary spending early."
  );

  return suggestions;
}

/**
 * ----------------------------------
 * 6. EXPENSE VS INCOME INSIGHT (NEW)
 * Qualitative financial health check
 * ----------------------------------
 */
export function expenseIncomeInsight(monthlyData) {
  if (!monthlyData || monthlyData.length === 0) return null;

  const last = monthlyData[monthlyData.length - 1];

  if (!last.income || last.income === 0) {
    return {
      text: "No income recorded this month. Insights are limited.",
      status: "warning",
    };
  }

  const percent = (last.expense / last.income) * 100;

  if (percent > 100) {
    return {
      text: `You spent ${percent.toFixed(
        1
      )}% of your income. Expenses exceeded income this month.`,
      status: "bad",
    };
  }

  if (percent > 80) {
    return {
      text: `You spent ${percent.toFixed(
        1
      )}% of your income. Consider reducing discretionary expenses.`,
      status: "warning",
    };
  }

  return {
    text: `Good job! You spent only ${percent.toFixed(
      1
    )}% of your income this month.`,
    status: "good",
  };
}
