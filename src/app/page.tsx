"use client";

import Papa from "papaparse";

import { useState, useMemo } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

import { NotValidRow, type Transaction } from "@/types/statement";

import { calculateSummary } from "@/lib/statement";
import { processCsvRows, exportTransactionsToCsv } from "@/lib/parser";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type FilterType = "all" | "income" | "expense";
const FILTER_OPTIONS = [
  { value: "all", label: "Усі операції" },
  { value: "income", label: "Доходи" },
  { value: "expense", label: "Витрати" },
] as const;

export default function BankStatementAnalyzer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notValidRows, setNotValidRows] = useState<NotValidRow[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      return alert("Будь ласка, виберіть CSV файл.");
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, unknown>[];
        const { validData, notValid } = processCsvRows(rawData);

        setTransactions(validData);
        setNotValidRows(notValid);
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // Drag-and-Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "income" && t.amount > 0) ||
        (filter === "expense" && t.amount < 0);

      const matchesSearch =
        t.counterparty.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, search]);

  const summary = useMemo(() => calculateSummary(transactions), [transactions]);

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Аналізатор виписки</h1>
      <ThemeToggle />
      {/* ЗАВАНТАЖЕННЯ ФАЙЛУ */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-6 text-center rounded-lg transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-slate-200 bg-slate-50/50"
        }`}
      >
        <p className="mb-2">Перетягніть CSV файл сюди або оберіть файл:</p>
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="cursor-pointer"
        />
      </div>

      {notValidRows.length > 0 && (
        <p className="text-red-500 mt-2 text-sm">
          Пропущено невалідних рядків: {notValidRows.length} (перевірте формат
          даних)
        </p>
      )}

      {/* КАРТКИ ПІДСУМКІВ */}
      {transactions.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Дохід
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +
                  {summary.totalIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Витрати
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  -
                  {summary.totalExpense.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Чистий результат
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${summary.netResult >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {summary.netResult.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Транзакцій
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary.transactionCount}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ФІЛЬТР + ПОШУК*/}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Input
              placeholder="Пошук за контрагентом або призначенням..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as FilterType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Всі транзакції" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => exportTransactionsToCsv(filteredTransactions)} // передаємо актуальні дані
              disabled={filteredTransactions.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Експорт CSV
            </Button>
          </div>

          {/* ТРАНЗАКЦІЇ */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Контрагент</TableHead>
                  <TableHead>Призначення</TableHead>
                  <TableHead className="text-right">Сума</TableHead>
                  <TableHead className="text-right">Тип</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t, index) => (
                    <TableRow key={index}>
                      <TableCell className="whitespace-nowrap">
                        {t.date}
                      </TableCell>
                      <TableCell className="font-medium">
                        {t.counterparty}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {t.description}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${t.amount > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {t.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right ">
                        {t.amount > 0 ? "Дохід" : "Витрата"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Нічого не знайдено за вашим запитом.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* ОПЕРАЦІЇ З НЕВАЛІДНИМИ РЯДКАМИ */}

          {notValidRows.length > 0 && (
            <section className="space-y-4 animate-in fade-in duration-500">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-red-600">
                  Проблемні рядки
                </h2>
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-sm font-medium">
                  {notValidRows.length}
                </span>
              </div>

              <div className="rounded-md border border-red-200 bg-red-50/30 overflow-hidden">
                <Table>
                  <TableHeader className="bg-red-50">
                    <TableRow>
                      <TableHead className="w-24 text-red-900 font-bold">
                        Номер рядка
                      </TableHead>
                      <TableHead className="text-red-900 font-bold">
                        Причина відмови
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notValidRows.map((row, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-red-50/50 transition-colors"
                      >
                        <TableCell className="font-mono font-medium text-red-600 px-6">
                          #{row.row}
                        </TableCell>
                        <TableCell className="text-red-700 py-3">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            {row.message}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground italic">
                * Ці рядки були проігноровані при розрахунку загальної
                статистики.
              </p>
            </section>
          )}

          {/* 3. НАЙБІЛЬШ ВИТРАТНІ КОНТРАГЕНТИ */}
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-bold tracking-tight">
              Топ-5 контрагентів (витрати)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {summary.topCounterparties.map((item, idx) => (
                <Card key={idx}>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle
                      className="text-xs uppercase text-muted-foreground truncate"
                      title={item.name}
                    >
                      {item.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="text-lg font-bold text-red-500">
                      -
                      {item.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
