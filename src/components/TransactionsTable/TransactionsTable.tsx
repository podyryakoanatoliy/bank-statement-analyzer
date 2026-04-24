import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Transaction } from "@/types/statement";

export default function TransactionsTable({
  filteredTransactions,
}: {
  filteredTransactions: Transaction[];
}) {
  return (
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
                <TableCell className="whitespace-nowrap">{t.date}</TableCell>
                <TableCell className="font-medium">{t.counterparty}</TableCell>
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
  );
}
