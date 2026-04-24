import { Transaction, StatementSummary } from "@/types/statement";

export const calculateSummary = (
  transactions: Transaction[],
): StatementSummary => {
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const counterpartyMap: Record<string, number> = {};
  transactions
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      counterpartyMap[t.counterparty] =
        (counterpartyMap[t.counterparty] || 0) + Math.abs(t.amount);
    });

  const topCounterparties = Object.entries(counterpartyMap)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    totalIncome,
    totalExpense,
    netResult: totalIncome - totalExpense,
    transactionCount: transactions.length,
    topCounterparties,
  };
};
