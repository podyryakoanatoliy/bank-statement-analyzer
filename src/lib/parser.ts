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
        row: index + 2,
        message: errorMsg,
      });
    }
  });

  return { validData, notValid };
};
