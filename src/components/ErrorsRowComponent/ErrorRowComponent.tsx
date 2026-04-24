import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { NotValidRow } from "@/types/statement";

export default function ErrorRowComponent({
  notValidRows,
}: {
  notValidRows: NotValidRow[];
}) {
  return (
    <section className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-red-600">Проблемні рядки</h2>
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
        * Ці рядки були проігноровані при розрахунку загальної статистики.
      </p>
    </section>
  );
}
