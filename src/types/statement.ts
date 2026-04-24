import { z } from "zod";

export const TransactionSchema = z.object({
  date: z.string().min(1, "Дата обов'язкова"),
  counterparty: z.string().min(1),
  description: z.string().min(1),
  amount: z.preprocess((val) => Number(val), z.number()),
});

export type Transaction = z.infer<typeof TransactionSchema>;

interface Parties {
  name: string;
  amount: number;
}

export type FilterType = "all" | "income" | "expense";

export interface StatementSummary {
  totalIncome: number;
  totalExpense: number;
  netResult: number;
  transactionCount: number;
  topCounterparties: Parties[];
}

export interface NotValidRow {
  row: number;
  message: string;
}
