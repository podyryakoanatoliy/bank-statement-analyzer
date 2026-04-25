import { Download } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { exportTransactionsToCsv } from "@/lib/parser";

import { FilterType, Transaction } from "@/types/statement";

const FILTER_OPTIONS = [
  { value: "all", label: "Усі операції" },
  { value: "income", label: "Доходи" },
  { value: "expense", label: "Витрати" },
] as const;

interface FilterBarProps {
  filter: FilterType;
  search: string;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filteredData: Transaction[];
}

export default function FilterBar({
  filteredData,
  filter,
  search,
  setFilter,
  setSearch,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <Input
        placeholder="Пошук за контрагентом або призначенням..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="flex gap-2">
        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as FilterType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Оберіть фільтр">
              {FILTER_OPTIONS.find((opt) => opt.value === filter)?.label}
            </SelectValue>
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
          onClick={() => exportTransactionsToCsv(filteredData)}
          disabled={filteredData.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Експорт CSV
        </Button>
      </div>
    </div>
  );
}
