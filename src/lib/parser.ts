import Papa from "papaparse";
import {
  TransactionSchema,
  type Transaction,
  type NotValidRow,
} from "@/types/statement";

interface ParseResult {
  validData: Transaction[];
  notValid: NotValidRow[];
}

export const processCsvRows = (
  rawData: Record<string, unknown>[],
): ParseResult => {
  const validData: Transaction[] = [];
  const notValid: NotValidRow[] = [];

  rawData.forEach((row, index) => {
    const parsed = TransactionSchema.safeParse(row);
    if (parsed.success) {
      validData.push(parsed.data);
    } else {
      const errorMsg = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");

      notValid.push({
        row: index + 1,
        message: errorMsg,
      });
    }
  });

  return { validData, notValid };
};

export const exportTransactionsToCsv = (data: Transaction[]) => {
  if (data.length === 0) return;

  const csv = Papa.unparse(data);

  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const fileName = `filtered_statement_${new Date().toISOString().slice(0, 10)}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
