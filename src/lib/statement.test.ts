import { expect, test } from "vitest";
import { calculateSummary } from "./statement";
import { Transaction } from "@/types/statement";

test("calculateSummary correctly calculates totals and top counterparties", () => {
  const mockData: Transaction[] = [
    {
      date: "2025-01-15",
      counterparty: "A",
      description: "desc",
      amount: 1000,
    },
    {
      date: "2025-01-16",
      counterparty: "B",
      description: "desc",
      amount: -500,
    },
    {
      date: "2025-01-17",
      counterparty: "B",
      description: "desc",
      amount: -200,
    },
  ];

  const result = calculateSummary(mockData);

  expect(result.totalIncome).toBe(1000);
  expect(result.totalExpense).toBe(700);
  expect(result.netResult).toBe(300);
  expect(result.topCounterparties[0].name).toBe("B");
});
