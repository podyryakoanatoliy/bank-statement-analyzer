## Bank Statement Analyzer (Next.js 15)

Зручний інструмент для бухгалтерів, який дозволяє швидко аналізувати банківські виписки у форматі CSV, переглядати статистику доходів/витрат та фільтрувати транзакції.

## Getting Started

Перед початком роботи, виконайте наступні кроки

1. 🚀 Клонуйте Репозиторій

```bash
git clone https://github.com/podyryakoanatoliy/bank-statement-analyzer.git
cd bank-statement-analyzer
```

2. Встановлення залежностей та запуск серверу

```bash
npm install
# or
npm i

npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у своєму браузері, щоб побачити результат.

## Learn More

# Ключові моменти

- [UI/UX:] - Використано компоненти shadcn-ui для створення сучасного інтерфейсу. Додано підтримку Dark Mode та можливість експорту відфільтрованих даних назад у CSV..
- [Drag-and-Drop] - Реалізовано зручну зону завантаження файлів для покращення досвіду користувача (UX)..

## 🛠 Технічний стек

- Framework: Next.js 15 (App Router)
- Language: TypeScript (Strict mode)
- UI: Tailwind CSS + shadcn/ui
- Parsing: PapaParse
- Validation: Zod
