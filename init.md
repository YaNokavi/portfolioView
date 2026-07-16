# portfolioView — Project Init Document

> **Назначение файла:** Контекстный документ для передачи состояния проекта нейросетям и новым участникам разработки. Описывает текущее состояние фронтенда, реализованный функционал, архитектуру, модели данных, системные требования и вектор дальнейшего развития.
>
> **Репозиторий:** https://github.com/YaNokavi/portfolioView  
> **Дата последнего обновления:** Июль 2026

---

## 1. Назначение системы

**portfolioView** — персональная система учёта активов, которая объединяет в едином дашборде криптовалюты, акции, вклады, фиатные остатки и другие активы, распределённые по разным местам хранения (биржи, кошельки, брокеры, банки).

**Текущий статус:** реализован фронтенд-прототип MVP (React + Redux Toolkit) с моковыми данными. Бэкенд не разработан. Архитектурные решения фронтенда приняты с прицелом на последующую интеграцию с REST API бэкенда (Spring Boot 4 / Java 25).

**Базовая валюта:** USD. Планируется поддержка RUB как второй валюты отображения.

---

## 2. Технологический стек (Frontend)

| Компонент                 | Выбор                          | Версия / Обоснование                                              |
| ------------------------- | ------------------------------ | ----------------------------------------------------------------- |
| Язык                      | TypeScript                     | 7.0.x; строгая типизация критична для финансовых данных           |
| UI-фреймворк              | React                          | 19.2.x; уже используется в проекте                                |
| Стейт-менеджмент          | Redux Toolkit + RTK Query      | 2.12.x / 9.3.x; RTK Query закрывает кеширование и серверный стейт |
| Графики                   | Recharts                       | 3.9.x; линейные графики, pie-chart, bar-chart                     |
| Стилизация                | SCSS Modules                   | Уже подключены через `sass-loader`; CSS-in-JS не требуется        |
| Сборщик                   | Webpack 5 + SWC                | 5.108.x; SWC обеспечивает быструю компиляцию                      |
| Архитектурная методология | Feature-Sliced Design (FSD)    | —                                                                 |
| Роутинг                   | React Router v7                | Нужно добавить; SPA с историей браузера                           |
| Формы                     | React Hook Form + Zod          | Ручной ввод активов, настройка аллокации, авторизация             |
| Дата/время                | date-fns                       | Форматирование временных меток снапшотов, периодов графиков       |
| Офлайн-кэш                | IndexedDB (через `idb`)        | Клиентский кэш снапшотов, цен и черновиков; см. раздел 9          |
| Линтинг                   | ESLint + Prettier              | Нужно добавить в devDependencies                                  |
| Тесты (план)              | Vitest + React Testing Library | Unit и компонентные тесты                                         |

### Конфигурация сборки

- Точка входа: `src/index.tsx`
- Алиас `@` → `src/` (настроен в `webpack.config.ts` и `tsconfig.json`)
- CSS Modules автоматически включаются для файлов с `.module.` в имени
- Обычные `.scss`/`.css` файлы — глобальные стили
- Dev-сервер: порт `3000`, HMR включён

---

## 3. Архитектура фронтенда (Feature-Sliced Design)

Проект строго следует методологии FSD. Каждый слой имеет одностороннюю зависимость: вышестоящие слои могут импортировать нижестоящие, но не наоборот.

**Правило Public API:** каждый слайс экспортирует только через `index.ts` в корне папки. Прямые импорты внутренних файлов запрещены.

```
src/
├── app/                    # Инициализация приложения, провайдеры
│   ├── providers/
│   │   ├── StoreProvider/  # Redux Store Provider
│   │   ├── RouterProvider/ # React Router (добавить)
│   │   └── ThemeProvider/  # (добавить по необходимости)
│   ├── styles/
│   │   └── index.css       # Глобальный CSS Reset
│   └── types/
├── pages/                  # Страницы — только компоновка виджетов
│   ├── DashboardPage/      # ✅ Реализована
│   ├── CategoryPage/       # 🔲 Запланирована
│   ├── AssetPage/          # 🔲 Запланирована
│   ├── AllocationPage/     # 🔲 Запланирована
│   ├── HistoryPage/        # 🔲 Запланирована
│   ├── SourcesPage/        # 🔲 Запланирована
│   ├── SettingsPage/       # 🔲 Запланирована
│   └── AuthPage/           # 🔲 Запланирована
├── widgets/                # Самостоятельные UI-блоки
│   ├── BalanceWidget/          # ✅ Redux
│   ├── PortfolioChartWidget/   # ⚠️ Мок-данные
│   ├── AssetSidebarWidget/     # ✅ Redux
│   ├── TopPerformerWidget/     # ✅ Redux (sparkline — мок)
│   ├── TransactionTableWidget/ # ✅ Redux
│   ├── AllocationChartWidget/  # 🔲 Запланирован
│   ├── CategoryListWidget/     # 🔲 Запланирован
│   ├── SyncStatusWidget/       # 🔲 Запланирован
│   └── PnLSummaryWidget/       # 🔲 Запланирован
├── features/               # Изолированные пользовательские сценарии
│   ├── add-asset/          # 🔲 Модалка + форма
│   ├── edit-asset/         # 🔲
│   ├── connect-source/     # 🔲
│   ├── manual-sync/        # 🔲
│   ├── set-allocation/     # 🔲
│   ├── export-data/        # 🔲
│   └── auth/               # 🔲
├── entities/               # Доменные модели и базовые компоненты
│   ├── Portfolio/          # ✅ Реализована
│   ├── Market/             # ✅ Реализована
│   ├── Asset/              # 🔲
│   ├── Category/           # 🔲
│   ├── Operation/          # 🔲
│   └── Source/             # 🔲
└── shared/                 # Переиспользуемые утилиты, UI, константы
    ├── api/                # RTK Query baseApi, baseUrl, interceptors
    ├── config/             # assetColors, currencyMap, periodOptions
    │   └── assetColors.ts  # ✅ BTC/ETH/SOL/USDT/DEFAULT
    ├── ui/                 # Button, Input, Modal, Badge, Tooltip, Table, Chart
    ├── lib/                # formatCurrency, formatDate, calcPnL, calcChange
    │                       # ⚠️ formatCurrency сейчас дублируется в 5 виджетах
    ├── types/              # Общие TS-типы и интерфейсы
    └── lib/idb/            # 🔲 IndexedDB-клиент (см. раздел 9)
```

---

## 4. Redux Store (текущее состояние)

### 4.1 StateSchema

```typescript
interface StateSchema {
  portfolio: PortfolioSchema; // Транзакции и позиции
  market: MarketSchema; // Рыночные цены
}
```

Конфигурация стора создаётся через функцию `createReduxStore(initialState?)` — не синглтон, что позволяет изолировать инстанс для тестов.

### 4.2 Сущность: Portfolio

**Файл:** `src/entities/Portfolio/`

```typescript
// ⚠️ ТЕХДОЛГ: при добавлении типов deposit/withdraw/transfer/dividend
// потребуется расширение TransactionType и миграция стейта + IDB-схемы (DB_VERSION++)
type TransactionType = "buy" | "sell";

interface Transaction {
  id: string;
  type: TransactionType;
  asset: string; // 'Bitcoin'
  symbol: string; // 'BTC'
  amount: number; // Количество монет
  price: number; // Цена за единицу в USD
  date: string;
}

interface PortfolioSchema {
  transactions: Transaction[];
}
```

**Текущий стейт:** 4 моковых записи (BTC x2 buy, ETH sell, SOL buy).

**Экшены:**

- `addTransaction(Transaction)` — добавляет транзакцию в начало массива

**Селекторы:**

- `selectTransactions(state)` — массив транзакций
- `selectPortfolioHoldings(state)` — мемоизированный (createSelector): агрегирует в `Record<symbol, AssetHolding>`

```typescript
interface AssetHolding {
  symbol: string;
  name: string;
  amount: number; // Текущее кол-во (buy - sell)
  totalInvested: number; // Сумма всех покупок в USD
  avgBuyPrice: number; // totalInvested / amount
}
```

**Алгоритм расчёта avgBuyPrice:** упрощённый Weighted Average Cost.

- `buy`: amount += tx.amount, totalInvested += tx.amount \* tx.price
- `sell`: amount -= tx.amount (totalInvested не корректируется)

> ⚠️ **Техдолг (MVP-блокер):** При `sell` totalInvested не уменьшается — это приводит к некорректному Unrealized PnL и avgBuyPrice. Требует исправления **до отображения реальных данных пользователю**. Бизнес-требования предписывают полноценный WAC: при sell уменьшать totalInvested пропорционально доле проданного amount.

### 4.3 Сущность: Market

**Файл:** `src/entities/Market/`

```typescript
type MarketPrices = Record<string, number>; // { 'BTC': 65000 }

interface MarketSchema {
  prices: MarketPrices;
  isLoading: boolean;
  error?: string;
}
```

**Текущий стейт:** хардкод `{ BTC: 65000, ETH: 3550, SOL: 148.5, USDT: 1.0 }`

**Экшены:** `updatePrice({ symbol, price })` — задел для WebSocket/polling

**Планируемый StateSchema после подключения бэкенда:**

```typescript
interface StateSchema {
  portfolio: PortfolioSchema;
  market: MarketSchema;
  auth: AuthSchema; // JWT, флаг авторизации
  settings: SettingsSchema; // Базовая валюта, выбранный период графика
  // portfolioApi, integrationApi, userApi — RTK Query slice'ы
}
```

---

## 5. Кросс-сущностные селекторы (Widgets)

### selectTotalBalanceMetrics

```typescript
// src/widgets/BalanceWidget/model/selectors/balanceSelectors.ts
{
  totalBalance: number; // Σ(amount * currentPrice)
  pnlValue: number; // totalBalance - totalInvested  ← Unrealized PnL
  pnlPercent: number; // (pnlValue / totalInvested) * 100
  isPositive: boolean;
}
```

> ℹ️ Данный селектор считает **Unrealized PnL** (нереализованная прибыль по текущим позициям). **Realized PnL** (зафиксированная прибыль от закрытых позиций) — отдельное требование, реализуется в следующей итерации (см. раздел 12).

### selectAssetAllocation

```typescript
// src/widgets/AssetSidebarWidget/model/selectors/sidebarSelectors.ts
{
  allocation: Array<{ name; symbol; value; amount; percent; color }>;
  totalValue: number;
}
// Сортировка: по убыванию value
```

### selectTopPerformer

```typescript
// src/widgets/TopPerformerWidget/model/selectors/topPerformerSelectors.ts
// null если портфель пуст, иначе:
{
  (symbol,
    name,
    avgBuyPrice,
    currentPrice,
    profitPercent, // ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100
    profitValue, // (currentPrice - avgBuyPrice) * amount
    isPositive);
}
```

---

## 6. Реализованные виджеты

Дашборд — **Bento Grid** с именованными CSS-областями.

| Виджет                   | Area           | Данные                      | Статус                     |
| ------------------------ | -------------- | --------------------------- | -------------------------- |
| `PortfolioChartWidget`   | `area-chart`   | AreaChart изменения баланса | ⚠️ Мок                     |
| `BalanceWidget`          | `area-balance` | Баланс + Unrealized PnL     | ✅ Redux                   |
| `TopPerformerWidget`     | `area-top`     | Лидер роста + sparkline     | ✅ Redux (sparkline — мок) |
| `AssetSidebarWidget`     | `area-sidebar` | Doughnut + список активов   | ✅ Redux                   |
| `TransactionTableWidget` | `area-table`   | Таблица транзакций          | ✅ Redux                   |

### Цветовая палитра (`shared/config/assetColors.ts`)

| BTC     | ETH     | SOL     | USDT    | DEFAULT |
| ------- | ------- | ------- | ------- | ------- |
| #F7931A | #627EEA | #14F195 | #26A17B | #94a3b8 |

---

## 7. Маршруты (роутинг)

Роутинг ещё не подключён. Планируется React Router v7.

| Маршрут                     | Страница                | Описание                                                                  |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------- |
| `/login`                    | `AuthPage`              | Форма входа (JWT); 2FA если включена на бэке                              |
| `/` → redirect `/dashboard` | —                       | Редирект на дашборд                                                       |
| `/dashboard`                | `DashboardPage`         | Главный экран: баланс, графики, структура портфеля, статусы синхронизации |
| `/categories`               | `CategoryPage`          | Список категорий с их стоимостью, долей, изменением и PnL                 |
| `/categories/:categoryId`   | `CategoryPage` (detail) | Детальная аналитика: исторический график, подкатегории, активы            |
| `/assets`                   | `AssetPage`             | Список всех позиций с фильтрацией и сортировкой                           |
| `/assets/:assetId`          | `AssetPage` (detail)    | Детальная карточка: цена, PnL, история, средняя цена входа                |
| `/allocation`               | `AllocationPage`        | Целевая аллокация: текущая vs целевая доли, расчёт ребалансировки         |
| `/history`                  | `HistoryPage`           | Журнал операций: фильтрация по типу, источнику, дате                      |
| `/sources`                  | `SourcesPage`           | Управление источниками: подключение, статус, последняя синхронизация      |
| `/settings`                 | `SettingsPage`          | Настройки: базовая валюта, уведомления, управление категориями            |

Все маршруты, кроме `/login`, защищены `PrivateRoute` — при отсутствии валидного JWT редирект на `/login`.

---

## 8. Взаимодействие с бэкендом (целевое состояние)

Фронтенд взаимодействует с бэкендом через REST JSON API. Бэкенд — Spring Boot 4 / Java 25, модульный монолит.

**Аутентификация:** Bearer-токен в заголовке `Authorization`. Access-токен — `localStorage`, refresh-токен — `httpOnly cookie` (если бэкенд поддерживает) или `localStorage` (фолбэк).

**Базовый URL:** `REACT_APP_API_URL` (env-переменная).

**Устаревшие данные:** если бэкенд возвращает `dataStale: true` — фронтенд показывает бейдж «Данные могут быть устаревшими» с временной меткой.

**Refresh-токен логика:** `baseQuery` оборачивается в `fetchBaseQueryWithReAuth` — при 401 автоматически вызывается `POST /api/auth/refresh`, при неуспехе — редирект на `/login`.

### Планируемые API-эндпоинты

| Метод    | Эндпоинт                         | Назначение             |
| -------- | -------------------------------- | ---------------------- |
| GET      | `/api/v1/portfolio/summary`      | Баланс, PnL, структура |
| GET      | `/api/v1/portfolio/positions`    | Список позиций         |
| GET/POST | `/api/v1/portfolio/transactions` | Журнал операций        |
| GET      | `/api/v1/portfolio/snapshots`    | История для графика    |
| GET      | `/api/v1/portfolio/categories`   | Список категорий       |
| GET      | `/api/v1/portfolio/pnl`          | PnL сводка             |
| GET      | `/api/v1/market/prices`          | Актуальные цены        |
| GET/PUT  | `/api/v1/allocation/target`      | Целевая аллокация      |
| GET/POST | `/api/v1/sources`                | Источники хранения     |
| POST     | `/api/v1/auth/login`             | Авторизация            |
| POST     | `/api/v1/auth/refresh`           | Обновление токена      |
| GET/PUT  | `/api/v1/user/settings`          | Настройки пользователя |
| GET      | `/api/v1/export/*`               | Экспорт CSV            |

### Планируемый Redux (после подключения бэкенда)

| Slice / API                  | Ответственность                                                     |
| ---------------------------- | ------------------------------------------------------------------- |
| `authSlice`                  | Токены, флаг авторизованности, статус загрузки                      |
| `portfolioApi` (RTK Query)   | Все запросы к `/api/v1/portfolio/*`; кеширование, инвалидация тегов |
| `integrationApi` (RTK Query) | Запросы к `/api/v1/sources/*` (источники, синхронизация)            |
| `settingsSlice`              | Локальный UI-стейт (выбранная валюта, период графика)               |
| `userApi` (RTK Query)        | Запросы к `/api/v1/user/*` и `/api/v1/export/*`                     |

### Целевые модели данных (бэкенд → фронтенд)

```typescript
// Transaction (Ledger entry)
{ id, type, source_id, instrument_id, symbol, amount, price,
  currency, price_usd, commission, date, external_id }

// Position
{ id, user_id, source_id, instrument_id, symbol, amount,
  avg_buy_price, avg_buy_price_source: 'calculated'|'imported'|'manual',
  current_price, current_value_usd, category_id, tags[] }

// Price point
{ id, instrument_id, source, price_type: 'market'|'last_close'|'manual'|'derived',
  quote_currency, price, price_usd, timestamp, is_stale }

// Portfolio snapshot
{ id, user_id, timestamp, total_value_usd, total_value_rub,
  by_category[], by_source[], prices_used{}, fx_rates_used{} }

// Storage source
{ id, user_id, name, type, currency, connection_status,
  last_sync_at, sync_status, sync_error, comment }
```

---

## 9. IndexedDB — офлайн-слой и клиентский кэш

IndexedDB используется как локальное хранилище для офлайн-режима и ускорения отображения данных до получения актуального ответа от бэкенда.

> ⚠️ **Зависимость от бэкенда:** реализация IndexedDB-кэша (снапшоты, цены, транзакции) целесообразна только после подключения бэкенда. До этого момента IDB наполнять нечем — источником данных является бэкенд, а не фронтенд. Реализация `shared/lib/idb/` запланирована параллельно с первым рабочим API-эндпоинтом.

### Сценарии использования

- **Офлайн-режим дашборда** — при недоступности бэкенда показываются последние закэшированные данные с бейджем «Данные могут быть устаревшими»
- **Кэш снапшотов для графика** — быстрое отображение графика изменения баланса до загрузки свежих данных (stale-while-revalidate)
- **Кэш рыночных цен** — последние известные цены при потере соединения; соответствует требованию бэкенда показывать `is_stale` данные
- **Черновики транзакций** — операции, добавленные в офлайн-режиме, ждут синхронизации с бэкендом
- **Пользовательские настройки** — базовая валюта, выбранный период графика, целевая аллокация (локальный кэш настроек)

### Рекомендуемый инструмент

`idb` — Promise-обёртка над IndexedDB с полной поддержкой TypeScript. Не требует внешних зависимостей помимо самой библиотеки.

```
npm install idb
```

### Структура хранилища

| Store                | Key         | Индексы          | Назначение                                             |
| -------------------- | ----------- | ---------------- | ------------------------------------------------------ |
| `snapshots`          | `timestamp` | —                | История снапшотов для графика                          |
| `market_prices`      | `symbol`    | —                | Последние известные цены по символу                    |
| `transactions`       | `id`        | `date`, `symbol` | Локальная копия журнала операций                       |
| `draft_transactions` | `id`        | `createdAt`      | Черновики в ожидании синхронизации с бэкендом          |
| `settings`           | `key`       | —                | Настройки пользователя (базовая валюта, период и т.д.) |

### Место в FSD-структуре

```
src/shared/lib/idb/
├── index.ts            # Public API: initDB(), getDB()
├── dbSchema.ts         # Типы хранилища, версия схемы, upgrade-хук
├── snapshotsStore.ts   # CRUD для snapshots
├── pricesStore.ts      # CRUD для market_prices
├── transactionsStore.ts # CRUD для transactions + draft_transactions
└── settingsStore.ts    # CRUD для settings

src/entities/Portfolio/model/db/
└── portfolioDb.ts      # Методы Portfolio, работающие с idb

src/entities/Market/model/db/
└── marketDb.ts         # Кэш цен
```

### Инициализация схемы

```typescript
// src/shared/lib/idb/dbSchema.ts
import { openDB, DBSchema } from "idb";

const DB_NAME = "portfolioView";
const DB_VERSION = 1;

interface PortfolioViewDB extends DBSchema {
  snapshots: { key: string; value: PortfolioSnapshot };
  market_prices: {
    key: string;
    value: { symbol: string; price: number; updatedAt: string };
  };
  transactions: { key: string; value: Transaction };
  draft_transactions: {
    key: string;
    value: Transaction & { createdAt: string };
  };
  settings: { key: string; value: { key: string; value: unknown } };
}

export const initDB = () =>
  openDB<PortfolioViewDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore("snapshots", { keyPath: "timestamp" });
      db.createObjectStore("market_prices", { keyPath: "symbol" });
      db.createObjectStore("transactions", { keyPath: "id" });
      db.createObjectStore("draft_transactions", { keyPath: "id" });
      db.createObjectStore("settings", { keyPath: "key" });
    },
  });
```

### Паттерн интеграции с RTK Query (stale-while-revalidate)

```typescript
// В RTK Query endpoint'е для снапшотов:
async queryFn(arg, _api, _extraOptions, baseQuery) {
  // 1. Мгновенно вернуть кэш из IndexedDB
  const cached = await getSnapshotsFromIDB();
  if (cached.length > 0) {
    // dispatch cached data immediately (оптимистичный рендер)
  }
  // 2. Запросить свежие данные с бэкенда
  const result = await baseQuery('/api/v1/portfolio/snapshots');
  if (result.data) {
    // 3. Обновить IndexedDB
    await saveSnapshotsToIDB(result.data);
  }
  return result;
}
```

### Ограничения и правила

- IndexedDB **не** является источником истины — им является бэкенд. IDB — только клиентский кэш.
- Черновики (`draft_transactions`) удаляются из IDB после успешной синхронизации с бэкендом.
- При очистке localStorage (выход из системы) IndexedDB также очищается через `db.clear()` по всем stores.
- Версия схемы (`DB_VERSION`) увеличивается при изменении структуры stores и обрабатывается в `upgrade`-хуке.

---

## 10. Нефункциональные требования

### Производительность

- Первая загрузка дашборда — не более 2 секунд (требование из системных требований бэкенда).
- Code splitting по маршрутам (`React.lazy` + `Suspense`) — каждая страница грузится отдельным chunk'ом.
- Мемоизация тяжёлых вычислений (totals, PnL aggregation) через `useMemo` или в RTK Query `transformResponse`.
- Графики с 730+ точками (2 года ежедневных снапшотов) рендерятся без блокировки основного потока.
- IndexedDB обеспечивает мгновенное отображение кэшированных данных до получения ответа от бэкенда.

### Безопасность

- Чувствительные данные (адреса кошельков, API-ключи) маскируются в UI: первые 4 и последние 4 символа.
- Токены не логируются в консоль и не попадают в Redux DevTools (применяется `serializableCheck` exclusion).
- Авторизованные маршруты защищены `PrivateRoute`.

### UX

- Состояния загрузки — skeleton-компоненты, не спиннеры на весь экран.
- Все формы валидируются через Zod-схемы до отправки на сервер.
- Числовые значения форматируются по базовой валюте: USD — `$1,234.56`, RUB — `1 234,56 ₽`.
- Период графика сохраняется в URL query params (`?period=7d`) для шаринга и навигации назад.

### Расширяемость

- Добавление новой страницы не требует изменений в существующих модулях (FSD).
- Добавление нового коннектора на бэкенде требует только добавления варианта в `SourceType` enum и иконки в `shared/config`.
- Recharts заменяем через абстракцию `shared/ui/Chart` без изменения виджетов.

---

## 11. Текущий техдолг

| Проблема                                                                          | Приоритет                                                              |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `totalInvested` не корректируется при `sell` — некорректный WAC и Unrealized PnL | 🔴 **MVP-блокер**: исправить до отображения реальных данных            |
| Нет тестов                                                                        | 🔴 Vitest + RTL                                                        |
| `TransactionType` не расширяем без миграции стейта и IDB-схемы                   | 🟡 Учесть при добавлении deposit/withdraw/transfer/dividend (DB_VERSION++) |
| `formatCurrency` дублируется в 5 виджетах                                        | 🟡 Вынести в `shared/lib/formatCurrency.ts`                            |
| Sparkline в TopPerformerWidget на моках                                           | 🟡 Заменить на реальные данные из снапшотов                            |
| Фильтры периода в PortfolioChartWidget не работают                                | 🟡 После подключения снапшотов                                         |
| Нет роутинга                                                                      | 🟡 Добавить React Router v7                                            |
| Нет ESLint/Prettier                                                               | 🟡 Добавить в devDependencies                                          |
| `PortfolioChartWidget` на моках                                                   | 🟡 Подключить к снапшотам Redux / IndexedDB                            |

---

## 12. Статус соответствия бизнес-требованиям

### Реализовано

| Требование                        | Статус          |
| --------------------------------- | --------------- |
| Единый дашборд с балансом         | ✅ Redux        |
| Структура по активам (allocation) | ✅ Redux        |
| Unrealized PnL (нереализованный)  | ✅ Redux (⚠️ некорректен при наличии sell — WAC-баг, MVP-блокер) |
| Лидер роста                       | ✅ Redux        |
| Журнал операций                   | ✅ Redux        |
| График изменения баланса          | ⚠️ Заглушка     |
| Экшен addTransaction              | ⚠️ Есть, UI нет |

### Запланировано (следующие итерации)

| Требование                                        | Приоритет                                 |
| ------------------------------------------------- | ----------------------------------------- |
| Исправление WAC при `sell` (корректный Unrealized PnL) | 🔴 **MVP-блокер** (до реальных данных) |
| Аутентификация JWT (`features/auth`, `AuthPage`)  | 🔴 Высокий (1й критерий MVP)              |
| `features/AddTransaction` (модалка)               | 🔴 Высокий                                |
| Реальные цены (бэкенд / CoinGecko API)            | 🔴 Высокий                                |
| Исторические снапшоты портфеля                    | 🔴 Высокий (требует бэкенд)               |
| Аналитика по категориям                           | 🔴 Высокий                                |
| IndexedDB-кэш (снапшоты, цены) — после бэкенда   | 🔴 Высокий (зависит от бэкенда)           |
| Целевая аллокация + ребалансировка                | 🟡 Средний                                |
| Realized PnL (зафиксированная прибыль от продаж) | 🟡 Средний                                |
| Типы операций: deposit/withdraw/transfer/dividend | 🟡 Средний (требует расширения TransactionType + миграции) |
| Фильтры периода на графике                        | 🟡 Средний                                |
| Мультивалютность (RUB)                            | 🟡 Средний                                |
| Интеграции: Bybit, OKX, Т-Инвестиции              | 🟡 Средний (бэкенд)                       |
| Уведомления Telegram                              | 🔵 Низкий                                 |
| Экспорт данных (CSV)                              | 🔵 Низкий                                 |

---

## 13. Критерии готовности MVP

MVP фронтенда можно считать готовым, если пользователь способен:

- [ ] Войти в систему по паролю и выйти из неё *(требует бэкенда: JWT, `POST /api/v1/auth/login`)*
- [ ] Видеть суммарную стоимость портфеля в USD и RUB
- [ ] Видеть график изменения стоимости портфеля за 24h, 7d, 30d, YTD *(требует бэкенда: снапшоты)*
- [ ] Видеть структуру портфеля по категориям (pie-chart + таблица)
- [ ] Видеть **Unrealized PnL** по каждому активу (кроме RUB/USD) *(разблокируется после исправления WAC-бага)*
- [ ] Добавить актив вручную через форму
- [ ] Подключить источник данных (Bybit, Т-Инвестиции, кошелёк) и увидеть его статус *(требует бэкенда)*
- [ ] Запустить синхронизацию вручную и увидеть результат *(требует бэкенда)*
- [ ] Задать целевую аллокацию и увидеть отклонение в процентах и деньгах
- [ ] Понять, откуда взялась средняя цена входа: из истории операций или ручного ввода
- [ ] Видеть кэшированные данные при недоступности бэкенда (IndexedDB) *(разблокируется после бэкенда)*
- [ ] Экспортировать историю операций в CSV

> ℹ️ **Realized PnL** (зафиксированная прибыль от закрытых позиций) **не входит в MVP**. MVP покрывает только Unrealized PnL. Realized PnL реализуется в следующей итерации после подключения бэкенда.

---

## 14. Переменные окружения

| Переменная          | Назначение          | Пример                       |
| ------------------- | ------------------- | ---------------------------- |
| `REACT_APP_API_URL` | Базовый URL бэкенда | `http://localhost:8080`      |
| `REACT_APP_ENV`     | Окружение           | `development` / `production` |
