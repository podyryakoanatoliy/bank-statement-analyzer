import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { StatementSummary } from "@/types/statement";

export default function CardSummary({
  summary,
}: {
  summary: StatementSummary;
}) {
  return (
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
          <div className="text-2xl font-bold">{summary.transactionCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
