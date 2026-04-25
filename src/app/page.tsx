"use client";

import { useState, useMemo } from "react";

import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import TransactionsTable from "@/components/TransactionsTable/TransactionsTable";
import ErrorRowComponent from "@/components/ErrorsRowComponent/ErrorRowComponent";
import MostExpense from "@/components/MostExpense/MostExpense";
import DownloadFile from "@/components/DownloadFile/DownloadFile";
import CardSummary from "@/components/CardSummary/CardSummary";
import FilterBar from "@/components/FilterBar/FilterBar";

import { calculateSummary } from "@/lib/statement";
import { getFilteredTransactions } from "@/lib/filterFunc";

import type { FilterType } from "@/types/statement";
import { NotValidRow, type Transaction } from "@/types/statement";

export default function BankStatementAnalyzer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notValidRows, setNotValidRows] = useState<NotValidRow[]>([]);

  const [filter, setFilter] = useState<FilterType>("");
  const [search, setSearch] = useState<string>("");

  const filteredTransactions = useMemo(
    () => getFilteredTransactions(transactions, filter, search),
    [transactions, filter, search],
  );

  const summary = useMemo(() => calculateSummary(transactions), [transactions]);

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header+Switcher */}
      <h1 className="text-3xl font-bold">Аналізатор виписки</h1>
      <ThemeToggle />

      {/* ЗАВАНТАЖЕННЯ ФАЙЛУ */}
      <DownloadFile
        saveNotValidData={setNotValidRows}
        saveValidData={setTransactions}
        notValidData={notValidRows}
      />

      {/* Card Render */}
      {transactions.length > 0 && (
        <>
          {/* Summary Cards */}
          <CardSummary summary={summary} />

          {/* ФІЛЬТР + ПОШУК + Download CSV*/}
          <FilterBar
            filter={filter}
            search={search}
            setFilter={setFilter}
            setSearch={setSearch}
            filteredData={filteredTransactions}
          />

          {/* ТРАНЗАКЦІЇ */}
          <TransactionsTable filteredTransactions={filteredTransactions} />

          {/* ОПЕРАЦІЇ З НЕВАЛІДНИМИ РЯДКАМИ */}

          {notValidRows.length > 0 && (
            <ErrorRowComponent notValidRows={notValidRows} />
          )}

          {/* 3. НАЙБІЛЬШ ВИТРАТНІ КОНТРАГЕНТИ */}
          <MostExpense summary={summary} />
        </>
      )}
    </main>
  );
}
