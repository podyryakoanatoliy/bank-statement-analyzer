import { FilterType, Transaction } from "@/types/statement";

export const getFilteredTransactions = (
  transactions: Transaction[],
  filter: FilterType,
  search: string,
) => {
  const s = search.toLowerCase().trim();

  return transactions.filter((t) => {
    const matchesFilter =
      filter === "all" || (filter === "income" ? t.amount > 0 : t.amount < 0);

    const matchesSearch =
      !s ||
      t.counterparty.toLowerCase().includes(s) ||
      t.description.toLowerCase().includes(s);

    return matchesFilter && matchesSearch;
  });
};
