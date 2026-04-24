import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { StatementSummary } from "@/types/statement";

export default function MostExpense({
  summary,
}: {
  summary: StatementSummary;
}) {
  return (
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
  );
}
