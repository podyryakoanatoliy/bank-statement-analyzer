import { useState } from "react";

import Papa from "papaparse";

import { Input } from "@/components/ui/input";

import { processCsvRows } from "@/lib/parser";

import { NotValidRow, type Transaction } from "@/types/statement";

interface DownloadFileProps {
  saveValidData: React.Dispatch<React.SetStateAction<Transaction[]>>;
  saveNotValidData: React.Dispatch<React.SetStateAction<NotValidRow[]>>;
  notValidData: NotValidRow[];
}
export default function DownloadFile({
  saveValidData,
  saveNotValidData,
  notValidData,
}: DownloadFileProps) {
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

        saveValidData(validData);
        saveNotValidData(notValid);
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

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

  return (
    <>
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

      {notValidData.length > 0 && (
        <p className="text-red-500 mt-2 text-sm">
          Пропущено невалідних рядків: {notValidData.length} (перевірте формат
          даних)
        </p>
      )}
    </>
  );
}
