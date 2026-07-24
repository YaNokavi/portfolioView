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

| Компонент                 | Выбор                          | Версия / Обоснование                                                 |
| ------------------------- | ------------------------------ | -------------------------------------------------------------------- |
| Язык                      | TypeScript                     | 7.0.x; строгая типизация критична для финансовых данных              |
| UI-фреймворк              | React                          | 19.2.x; уже используется в проекте                                   |
| Стейт-менеджмент          | Redux Toolkit + RTK Query      | 2.12.x / 9.3.x; RTK Query закрывает кеширование и серверный стейт    |
| Графики                   | Recharts                       | 3.9.x; линейные графики, pie-chart, bar-chart                        |
| Стилизация                | SCSS Modules                   | Уже подключены через `sass-loader`; CSS-in-JS не требуется           |
| Сборщик                   | Webpack 5 + SWC                | 5.108.x; SWC обеспечивает быструю компиляцию                         |
| Архитектурная методология | Feature-Sliced Design (FSD)    | —                                                                    |
| Роутинг                   | React Router v7                | ✅ Подключён: `createBrowserRouter` в `app/providers/RouterProvider` |
| Формы                     | React Hook Form + Zod          | Ручной ввод активов, настройка аллокации                             |
| Дата/время                | date-fns                       | Форматирование временных меток снапшотов, периодов графиков          |
| Офлайн-кэш                | IndexedDB (через `idb`)        | Клиентский кэш снапшотов, цен и черновиков; см. раздел 9             |
| Линтинг                   | ESLint + Prettier              | Нужно добавить в devDependencies                                     |
| Тесты (план)              | Vitest + React Testing Library | Unit и компонентные тесты                                            |

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
│   │   ├── StoreProvider/  # ✅ Redux Store Provider
│   │   └── RouterProvider/ # ✅ React Router v7 (createBrowserRouter)
│   ├── layouts/
│   │   └── AppLayout/      # ✅ Основной layout: AppSidebar + Outlet (скролл только в Outlet)
│   ├── styles/
│   │   └── index.css       # Глобальный CSS Reset
│   └── types/
├── pages/                  # Страницы — только компоновка виджетов
│   ├── DashboardPage/      # ✅ Реализована (bento-grid, все виджеты)
│   ├── AuthPage/           # ✅ Реализована (mock: email+password, сохраняет token в localStorage)
│   ├── AssetListPage/      # ✅ Реализована (карточка, таблица, PnL, empty state, палитра через CSS-переменные) 🔲 Не реализованы фильтры/сортировки таблицы
│   ├── CategoryPage/       # 🔲 не MVP
│   ├── AllocationPage/     # 🔲 не MVP
│   ├── HistoryPage/        # 🔲 не MVP
│   ├── SourcesPage/        # 🔲 не MVP
│   └── SettingsPage/       # 🔲 не MVP
├── widgets/                # Самостоятельные UI-блоки
│   ├── BalanceWidget/          # ✅ Redux (нужны: кнопки периода, иконка глаза, RUB)
│   ├── PortfolioChartWidget/   # ⚠️ Мок-данные (нужны: реальные снапшоты, фильтры периода)
│   ├── AssetSidebarWidget/     # ✅ Redux (нужно: drill-down по подкатегориям)
│   ├── TopPerformerWidget/     # ✅ Redux (sparkline — мок; нужна подпись «7D Change»)
│   ├── TransactionTableWidget/ # ✅ Redux
│   ├── AppSidebar/             # ✅ Реализован: логотип, nav (collapse), профиль
│   ├── AllocationChartWidget/  # 🔲 Запланирован
│   ├── CategoryListWidget/     # 🔲 Запланирован
│   ├── SyncStatusWidget/       # 🔲 Запланирован
│   └── PnLSummaryWidget/       # 🔲 Запланирован
├── features/               # Изолированные пользовательские сценарии
│   ├── add-asset/          # ✅ Реализована как модалка (не страница!)
│   │   ├── model/
│   │   │   ├── useAssetModal.ts   # ✅ Стейт-машина режимов: add / edit(symbol) / null
│   │   │   ├── types.ts            # ✅ ModalMode через generic Action<Type, Payload>
│   │   │   └── schema.ts           # ✅ Zod-схема (symbol, name, amount, price, date)
│   │   └── ui/
│   │       ├── AddAssetModal.tsx   # ✅ Динамический заголовок (Add/Edit asset)
│   │       └── AddAssetForm.tsx    # ✅ RHF + Zod, dispatch addTransaction
│   ├── edit-asset/         # ⚠️ Частично — режим "edit" в ModalMode заведён, но
│   │                        #   предзаполнение формы данными holding ещё не реализовано
│   ├── add-operation/      # 🔲 MVP — BUY/SELL/ADJUSTMENT по существующей позиции
│   ├── manual-sync/        # 🔲 MVP — кнопка обновления цен
│   ├── switch-currency/    # 🔲 MVP — переключение USD/RUB
│   ├── connect-source/     # 🔲 не MVP
│   ├── set-allocation/     # 🔲 не MVP
│   └── export-data/        # 🔲 не MVP
├── entities/               # Доменные модели и базовые компоненты
│   ├── Portfolio/          # ✅ Реализована (WAC исправлен в selectPortfolioHoldings)
│   ├── Market/             # ✅ Реализована
│   ├── Asset/              # 🔲 MVP
│   ├── Category/           # 🔲 MVP
│   ├── Operation/          # 🔲 MVP
│   └── Source/             # 🔲 не MVP (MVP: только GET /sources для селекта)
└── shared/                 # Переиспользуемые утилиты, UI, константы
    ├── api/                # RTK Query baseApi, baseUrl, interceptors
    ├── config/             # assetColors, currencyMap, periodOptions
    │   └── assetColors.ts  # ✅ BTC/ETH/SOL/USDT/DEFAULT
    ├── ui/
    │   ├── WidgetCard/      # ✅
    │   ├── Modal/           # ✅ Новый — портал в #modal-root, esc-закрытие, скролл-лок
    │   ├── Input/           # ✅ Доработан: добавлен проп label, spellCheck={false}
    │   └── Button/          # ✅ variant/isLoading/leftIcon/fullWidth
    ├── lib/                # ✅ formatCurrency.ts — вынесен, используется во всех
    │                       # Планируется: formatDate, calcPnL, calcChange
    ├── types/              # Общие TS-типы и интерфейсы
    └── lib/idb/            # 🔲 IndexedDB-клиент (после подключения бэкенда)
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

**Алгоритм расчёта avgBuyPrice:** Weighted Average Cost. ✅ Исправлен.

- `buy`: `amount += tx.amount`, `totalInvested += tx.amount * tx.price`
- `sell`: `sellRatio = tx.amount / holding.amount`, `totalInvested -= sellRatio * totalInvested`, `amount -= tx.amount`

После обхода всех транзакций: `avgBuyPrice = totalInvested / amount` (если amount > 0).

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
  session: SessionSchema; // userId, nickname, baseCurrency (вместо JWT — X-User-Id)
  settings: SettingsSchema; // Базовая валюта, выбранный период графика
  // dashboardApi, assetsApi, referenceApi — RTK Query slice'ы
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

> ℹ️ Данный селектор считает **Unrealized PnL** (нереализованная прибыль по текущим позициям). **Realized PnL** — отдельное требование, реализуется после подключения бэкенда.

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

## 6. Реализованные виджеты (Dashboard)

Дашборд — **Bento Grid** с именованными CSS-областями. Все виджеты используют общий `WidgetCard` из `shared/ui/WidgetCard`.

| Виджет                   | Area           | Данные                      | Статус                      |
| ------------------------ | -------------- | --------------------------- | --------------------------- |
| `PortfolioChartWidget`   | `area-chart`   | AreaChart изменения баланса | ⚠️ Мок (оранжевый градиент) |
| `BalanceWidget`          | `area-balance` | Баланс + Unrealized PnL     | ✅ Redux                    |
| `TopPerformerWidget`     | `area-top`     | Лидер роста + sparkline     | ✅ Redux (sparkline — мок)  |
| `AssetSidebarWidget`     | `area-sidebar` | Doughnut + список активов   | ✅ Redux                    |
| `TransactionTableWidget` | `area-table`   | Таблица транзакций          | ✅ Redux                    |

### Что осталось доработать в дашборде (сверка с макетом)

| Элемент                | Что нужно сделать                                                          |
| ---------------------- | -------------------------------------------------------------------------- |
| `BalanceWidget`        | Кнопки периода (24h/7d/30d/YTD), иконка скрытия баланса, отображение в RUB |
| `PortfolioChartWidget` | Подключить к `GET /dashboard` (valueHistory), активные фильтры периода     |
| `TopPerformerWidget`   | Подпись «7D Change» вместо «Текущая:», sparkline из реальных снапшотов     |
| `AssetSidebarWidget`   | Drill-down по подкатегориям через `GET /dashboard/allocation`              |

### `AppSidebar` — детали реализации

Компонент реализован в `src/widgets/AppSidebar/`. Структура:

- `ui/AppSidebar.tsx` — корневой `<aside>`, управляет `isCollapsed` через `useState`
- `ui/SidebarLogo/` — логотип `/logo.png` + текст `portfolioView`
- `ui/SidebarNav/` — список `NavLink` из `react-router-dom`, поддержка активного состояния
- `ui/SidebarProfile/` — аватар (инициалы), имя, план, иконка chevron
- `model/sidebarConfig.ts` — массивы `NAV_ITEMS` и `BOTTOM_NAV_ITEMS` с иконками `lucide-react`

> ⚠️ **Техдолг:** `SidebarProfile` получает захардкоженные пропсы (`name="user"`, `plan="pro"`). После реализации `session`-стейта — заменить на данные из Redux.

### `shared/lib/formatCurrency`

✅ Вынесен в `src/shared/lib/formatCurrency.ts`, экспортируется через `src/shared/lib/index.ts`.

Используется во всех виджетах: `BalanceWidget`, `TopPerformerWidget`, `AssetSidebarWidget`, `TransactionTableWidget`, `PortfolioChartWidget`.

### Цветовая палитра (`shared/config/assetColors.ts`)

| BTC     | ETH     | SOL     | USDT    | DEFAULT |
| ------- | ------- | ------- | ------- | ------- |
| #F7931A | #627EEA | #14F195 | #26A17B | #94a3b8 |

### `shared/ui/WidgetCard`

Общий контейнер для всех виджетов дашборда. Принимает `title`, `action` (правый элемент заголовка) и `children`.

```typescript
interface WidgetCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}
```

`WidgetCard.module.scss` имеет `position: relative; overflow: hidden` — необходимо для абсолютно позиционированных элементов (спарклайн в TopPerformerWidget).

---

## 7. MVP-экраны и статус реализации

### 7.1 Вход (AuthPage) ✅ частично реализовано

- Форма: `email` + `password` (React Hook Form)
- Mock-логика: сравнение с `MOCK_USER`, имитация запроса 800мс
- При успехе: `localStorage.setItem("token", "mock-jwt-token")` → `navigate("/dashboard")`
- Защита маршрутов в `AppLayout`: `localStorage.getItem("token")`, при отсутствии — `<Navigate to="/login" />`

> ⚠️ **Техдолг:** по `init.md` MVP предполагает вход по нику (`POST /session`), без пароля. Текущая реализация использует email+password mock. При подключении бэкенда — заменить на `POST /api/v1/session` + `X-User-Id` заголовок. Ключ в localStorage сменить с `"token"` на `"userId"`.

### 7.2 Главный дашборд (DashboardPage) ✅ частично

- [x] Bento-grid структура с 5 виджетами
- [x] Общая стоимость портфеля (Redux, мок)
- [x] PnL Unrealized (Redux, WAC исправлен ✅)
- [x] Диаграмма аллокации по активам (Redux)
- [x] Top Performer (Redux)
- [x] Таблица транзакций (Redux)
- [x] Навигационный сайдбар `AppSidebar` ✅
- [ ] График с реальными данными (`GET /dashboard?period=7D`)
- [ ] Фильтры периода: 24h / 7d / 30d / YTD / CUSTOM
- [ ] PnL за выбранный период (из `periodPnL` ответа API)
- [ ] Диаграмма по подкатегориям (`GET /dashboard/allocation?groupBy=subcategory`)
- [ ] Кнопка ручного обновления цен (`POST /portfolio/refresh`)
- [ ] Переключатель базового актива USD / RUB

### 7.3 Список активов (AssetListPage) ✅ реализовано (без фильтров и API)

- Таблица позиций: актив (иконка + имя + тикер), amount, avg buy, current, value, PnL
- Данные берутся из `selectPortfolioHoldings` (Redux, моки) — без пагинации и фильтров API
- PnL скрывается для USD/RUB/USDT (`pnlAvailable: false`), рендерится "—"
- Empty state — если позиций нет, показывается строка-заглушка на всю ширину таблицы
- Кнопка "Add asset" в шапке карточки открывает модалку (см. 7.5), не переход по роуту
- Стилизация приведена к общему UI: карточка, hover на строках, цвета через CSS-переменные (`--color-positive`, `--color-negative`, `--color-bg-card` и т.д.)

**Осталось:** сортировка по колонкам, фильтры (categoryId, sourceId, search), клик по строке → переход в edit-режим модалки, пагинация после подключения `GET /assets`.

⚠️ **Известный кейс в моках:** транзакция sell ETH превышает фактический остаток → `amount` уходит в отрицательное значение, `avgBuyPrice = 0`. Это осознанно не фиксится — баг мок-данных, не логики `selectPortfolioHoldings`.

### 7.4 Карточка актива (AssetDetailPage) 🔲 не MVP

### 7.5 Добавление и редактирование актива (модалка, не страница) ✅ частично реализовано

> ⚠️ **Архитектурное решение изменено:** изначально планировалась отдельная страница `AddAssetPage`
> с роутами `/assets/add` и `/assets/:id/edit`. По факту эти роуты никогда не были зарегистрированы —
> в роутере есть только `/assets` (список) и `/assets/:assetId` (заглушка под будущую detail-страницу).
> Решено реализовать add/edit как **модалку** через `shared/ui/Modal` (портал в `#modal-root`),
> без изменения URL — это транзакционное действие, а не самостоятельный экран.

**Реализовано:**

- `shared/ui/Modal` — универсальная обёртка: `createPortal` в `#modal-root`, закрытие по Escape и клику на оверлей, блокировка скролла body на время открытия
- `features/add-asset/model/useAssetModal` — хук с состоянием `{ type: "add" } | { type: "edit", symbol } | null`
- `ModalMode` типизирован через generic `Action<Type, Payload>` для чистоты дискриминированного union
- `AddAssetModal` — динамический заголовок ("Add asset" / "Edit asset") в зависимости от режима
- `AddAssetForm` — React Hook Form + Zod, поля: symbol, name, amount, price, date
- Сабмит диспатчит `addTransaction` в `entities/Portfolio` (тип всегда `"buy"` на данный момент)

**Не реализовано:**

- Режим `edit` не предзаполняет форму данными существующей позиции
- Нет выбора типа операции (BUY/SELL/ADJUSTMENT) — только buy
- Нет валидации тикера через `GET /instruments/validate` (бэкенда нет)
- Нет категории/подкатегории и источника хранения в форме
- Нет обработки `409 ASSET_ALREADY_EXISTS`

### 7.6 Аналитика категорий (CategoryPage) 🔲 не MVP

### 7.7 Источники хранения (SourcesPage) 🔲 не MVP

### 7.8 Управление категориями (не MVP)

### 7.9 Настройки профиля (не MVP)

---

## 8. REST API — контракт (frontend-api.md)

Базовый URL: `/api/v1`. Формат: JSON. Временные метки: ISO 8601 UTC. Числа без форматирования.

### Аутентификация MVP

**Нет JWT.** Frontend хранит `userId` в localStorage и передаёт во всех запросах:

```http
X-User-Id: e2f8ee9d-7acb-4e09-a2e6-538d59fd922a
```

При добавлении аутентификации бэкенд заменит этот заголовок на access token, сохранив остальной контракт.

### Ошибки

```json
{
  "code": "INSTRUMENT_NOT_FOUND",
  "message": "Инструмент с тикером UNKNOWN не найден",
  "fieldErrors": [{ "field": "symbol", "message": "Проверьте тикер" }]
}
```

| Статус | Значение                                              |
| ------ | ----------------------------------------------------- |
| `200`  | Успешный запрос                                       |
| `201`  | Сущность создана                                      |
| `202`  | Асинхронная задача принята                            |
| `400`  | Неверные параметры или бизнес-валидация               |
| `404`  | Сущность не найдена или не принадлежит пользователю   |
| `409`  | Конфликт (например, актив уже существует в источнике) |
| `422`  | Невозможно выполнить расчёт                           |

### Эндпоинты MVP

#### Сессия и настройки

| Метод   | Путь                | Назначение                                                                        |
| ------- | ------------------- | --------------------------------------------------------------------------------- |
| `POST`  | `/session`          | Вход по нику. Request: `{nickname}`. Response: `{userId, nickname, baseCurrency}` |
| `PATCH` | `/profile/settings` | Смена базовой валюты. Request: `{baseCurrency: "RUB"}`                            |

#### Дашборд

| Метод  | Путь                             | Назначение                                                                             |
| ------ | -------------------------------- | -------------------------------------------------------------------------------------- |
| `GET`  | `/dashboard`                     | Все данные дашборда. Query: `currency`, `period` (24H/7D/30D/YTD/CUSTOM), `from`, `to` |
| `GET`  | `/dashboard/allocation`          | Аллокация по подкатегориям. Query: `groupBy=subcategory`, `categoryId`, `currency`     |
| `POST` | `/portfolio/refresh`             | Ручное обновление цен. Response `202`: `{refreshId, status: "STARTED"}`                |
| `GET`  | `/portfolio/refresh/{refreshId}` | Статус обновления. Опрашивать до `COMPLETED` или `FAILED`                              |

**Структура ответа `GET /dashboard`:**

```json
{
  "currency": "USD",
  "totalValue": 152430.55,
  "valuationCalculatedAt": "2026-07-16T17:00:10Z",
  "periodPnL": { "absolute": 3420.18, "percent": 2.29 },
  "valueHistory": [{ "timestamp": "...", "value": 148120.35 }],
  "allocationByCategory": [
    {
      "category": { "id": "crypto", "name": "Криптовалюта" },
      "value": 95000.0,
      "sharePercent": 62.32
    }
  ],
  "topPerformer": {
    "assetId": "uuid",
    "symbol": "BTC",
    "name": "Bitcoin",
    "pnl": 5400.0,
    "pnlPercent": 18.8
  },
  "marketDataStatus": [
    {
      "provider": "COINGECKO",
      "status": "SUCCESS",
      "isStale": false,
      "lastSuccessfulRefreshAt": "..."
    },
    {
      "provider": "MOEX_ISS",
      "status": "FAILED",
      "isStale": true,
      "message": "Используются последние доступные котировки"
    }
  ]
}
```

> `topPerformer` — только активы с доступным PnL. RUB, USD, USDT исключаются. Если таких нет — `null`.
> `marketDataStatus` — нужен для предупреждения о частично устаревших ценах.

#### Активы

| Метод    | Путь                | Назначение                                                                                                                  |
| -------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/assets`           | Список позиций. Query: `currency`, `page`, `size`, `categoryId`, `subcategoryId`, `sourceId`, `assetType`, `search`, `sort` |
| `GET`    | `/assets/{assetId}` | Детали позиции (для формы редактирования)                                                                                   |
| `POST`   | `/assets`           | Создать ручную позицию + начальную операцию                                                                                 |
| `PATCH`  | `/assets/{assetId}` | Изменить только метаданные (не количество!)                                                                                 |
| `DELETE` | `/assets/{assetId}` | Удалить ошибочно созданную ручную позицию                                                                                   |

#### Операции по позиции

| Метод  | Путь                           | Назначение                       |
| ------ | ------------------------------ | -------------------------------- |
| `POST` | `/assets/{assetId}/operations` | Добавить BUY / SELL / ADJUSTMENT |
| `GET`  | `/assets/{assetId}/operations` | История операций по позиции      |

**Типы операций:**

| `type`       | Влияние на среднюю цену                |
| ------------ | -------------------------------------- |
| `BUY`        | Средневзвешенный пересчёт              |
| `SELL`       | Не меняет среднюю цену остатка         |
| `ADJUSTMENT` | Требует явно задать новую среднюю цену |

#### Справочники

| Метод  | Путь                    | Назначение                                                               |
| ------ | ----------------------- | ------------------------------------------------------------------------ |
| `GET`  | `/reference/categories` | Категории + подкатегории для формы актива                                |
| `GET`  | `/sources`              | Источники хранения для селекта                                           |
| `POST` | `/sources`              | Создать новый ручной источник                                            |
| `GET`  | `/instruments/validate` | Проверить тикер через CoinGecko / MOEX ISS. Query: `symbol`, `assetType` |

> Frontend **не обращается напрямую** к CoinGecko или MOEX — только через бэкенд.

### Последовательность запросов на страницах

**Вход:**

1. `POST /session` → сохранить `userId` + `baseCurrency`
2. Открыть дашборд

**Дашборд:**

1. `GET /dashboard?currency={currency}&period=30D`
2. При клике на категорию → `GET /dashboard/allocation?groupBy=subcategory&categoryId=...`
3. При ручном обновлении → `POST /portfolio/refresh` → опрос `GET /portfolio/refresh/{id}` → повторить `GET /dashboard`

**Список активов:**

1. `GET /assets` с нужными фильтрами, пагинацией, сортировкой
2. Для редактирования → `GET /assets/{assetId}`

**Добавление ручного актива:**

1. Параллельно: `GET /reference/categories` + `GET /sources`
2. После ввода тикера → `GET /instruments/validate`
3. При необходимости создать источник → `POST /sources`
4. Отправить форму → `POST /assets`

**Докупка / продажа:**

1. `GET /assets/{assetId}`
2. `POST /assets/{assetId}/operations` (BUY / SELL / ADJUSTMENT)
3. Обновить список и дашборд

---

## 9. Маршруты (роутинг)

Роутинг реализован: `createBrowserRouter` в `src/app/providers/RouterProvider/ui/AppRouter.tsx`.

| Маршрут            | Страница          | MVP? | Статус               |
| ------------------ | ----------------- | :--: | -------------------- |
| `/login`           | `AuthPage`        |  ✅  | ✅ Реализован (mock) |
| `/` → `/dashboard` | —                 |  ✅  | ✅ Редирект          |
| `/dashboard`       | `DashboardPage`   |  ✅  | ✅ Реализован        |
| `/assets`          | `AssetListPage`   |  ✅  | ✅ Реализован        |
| `/assets/:assetId` | detail (заглушка) |  ❌  | 🔲 Не MVP пока       |
| `/categories`      | `CategoryPage`    |  ❌  | 🔲 Заглушка          |
| `/allocation`      | `AllocationPage`  |  ❌  | 🔲 Заглушка          |
| `/history`         | `HistoryPage`     |  ❌  | 🔲 Заглушка          |
| `/sources`         | `SourcesPage`     |  ❌  | 🔲 Заглушка          |
| `/settings`        | `SettingsPage`    |  ❌  | 🔲 Заглушка          |

Все маршруты, кроме `/login`, защищены проверкой `localStorage.getItem("token")` в `AppLayout`. При отсутствии — редирект на `/login`.

---

## 10. IndexedDB — офлайн-слой и клиентский кэш

IndexedDB используется как локальное хранилище для офлайн-режима и ускорения отображения данных до получения актуального ответа от бэкенда.

> ⚠️ **Зависимость от бэкенда:** реализация IndexedDB-кэша целесообразна только после подключения бэкенда. До этого момента IDB наполнять нечем. Реализация `shared/lib/idb/` запланирована параллельно с первым рабочим API-эндпоинтом.

### Сценарии использования

- **Офлайн-режим дашборда** — при недоступности бэкенда показываются последние закэшированные данные с бейджем «Данные могут быть устаревшими»
- **Кэш снапшотов для графика** — stale-while-revalidate
- **Кэш рыночных цен** — последние известные цены при потере соединения
- **Черновики транзакций** — операции, добавленные в офлайн-режиме
- **Пользовательские настройки** — базовая валюта, выбранный период

### Структура хранилища

| Store                | Key         | Назначение                         |
| -------------------- | ----------- | ---------------------------------- |
| `snapshots`          | `timestamp` | История снапшотов для графика      |
| `market_prices`      | `symbol`    | Последние известные цены           |
| `transactions`       | `id`        | Локальная копия журнала операций   |
| `draft_transactions` | `id`        | Черновики в ожидании синхронизации |
| `settings`           | `key`       | Настройки пользователя             |

### Место в FSD-структуре

```
src/shared/lib/idb/
├── index.ts
├── dbSchema.ts
├── snapshotsStore.ts
├── pricesStore.ts
├── transactionsStore.ts
└── settingsStore.ts
```

### Ограничения и правила

- IndexedDB **не** является источником истины — им является бэкенд.
- Черновики удаляются после успешной синхронизации.
- При выходе из системы — `db.clear()` по всем stores.
- `DB_VERSION` увеличивается при изменении структуры stores.

---

## 11. Нефункциональные требования

### Производительность

- Первая загрузка дашборда — не более 2 секунд.
- Code splitting по маршрутам (`React.lazy` + `Suspense`).
- Мемоизация тяжёлых вычислений (totals, PnL aggregation) через `useMemo` или в RTK Query `transformResponse`.
- IndexedDB обеспечивает мгновенное отображение кэшированных данных.

### Безопасность

- Чувствительные данные (адреса кошельков) маскируются: первые 4 и последние 4 символа.
- `userId` не логируется в консоль и не попадает в Redux DevTools.

### UX

- Состояния загрузки — skeleton-компоненты, не спиннеры на весь экран.
- Все формы валидируются через Zod-схемы до отправки на сервер.
- USD: `$1,234.56`, RUB: `1 234,56 ₽`.
- Период графика сохраняется в URL query params (`?period=7d`).
- При `marketDataStatus[].isStale = true` — показывать бейдж «Данные могут быть устаревшими» с временной меткой.

---

## 12. Текущий техдолг

| Проблема                                             | Приоритет                                   |
| ---------------------------------------------------- | ------------------------------------------- | --- |
| Нет тестов                                           | 🔴 Vitest + RTL                             |
| `SidebarProfile` — захардкоженные пропсы (name/plan) | 🟡 Заменить на session-стейт после бэкенда  |     |
| `TransactionType` не расширяем без миграции стейта   | 🟡 При добавлении deposit/withdraw/transfer |
| Sparkline в TopPerformerWidget на моках              | 🟡 Заменить на снапшоты после бэкенда       |
| Фильтры периода в PortfolioChartWidget не работают   | 🟡 После подключения API                    |
| PortfolioChartWidget на моках                        | 🟡 Подключить к `GET /dashboard`            |
| Нет ESLint/Prettier                                  | 🟡 Добавить в devDependencies               |
| Кнопки периода в BalanceWidget отсутствуют           | 🟡 24h/7d/30d/YTD                           |
| Переключатель USD/RUB отсутствует                    | 🟡 `PATCH /profile/settings`                |
| AuthPage использует email+password вместо ника       | 🟡 Заменить при подключении бэкенда         |
| Режим edit в AddAssetModal не предзаполняет форму    | 🟡 Прикрутить при доработке edit-сценария   |
| AddAssetForm не поддерживает SELL/ADJUSTMENT         | 🟡 Только BUY на данный момент              |
| Input не имел label до правки — теперь ✅ добавлен   | ✅ Закрыто                                  |

---

## 13. Статус соответствия требованиям MVP

### Реализовано

| Требование                               | Статус                  |
| ---------------------------------------- | ----------------------- |
| `AssetListPage` — таблица позиций        | ✅ Redux (без фильтров) |
| Модалка добавления актива (add-asset)    | ✅ RHF + Zod            |
| `shared/ui/Modal` — портал-компонент     | ✅                      |
| Дашборд с балансом                       | ✅ Redux (мок)          |
| Структура по активам (allocation)        | ✅ Redux                |
| Unrealized PnL                           | ✅ Redux, WAC исправлен |
| Лидер роста                              | ✅ Redux                |
| Журнал операций                          | ✅ Redux                |
| Bento-grid адаптивный дашборд            | ✅                      |
| WidgetCard — общий компонент             | ✅                      |
| Дизайн-система (CSS-переменные, палитра) | ✅                      |
| Навигационный сайдбар `AppSidebar`       | ✅ с collapse           |
| Роутинг React Router v7                  | ✅ createBrowserRouter  |
| Защита маршрутов (token guard)           | ✅ в AppLayout          |
| Страница входа `AuthPage`                | ✅ mock                 |
| AppLayout (скролл только в Outlet)       | ✅                      |
| `formatCurrency` в `shared/lib`          | ✅                      |

### Запланировано для MVP

| Требование                                     | Приоритет |
| ---------------------------------------------- | --------- |
| `GET /dashboard` + реальный график             | 🔴        |
| Фильтры периода: 24h/7d/30d/YTD/CUSTOM         | 🔴        |
| Переключатель USD/RUB                          | 🔴        |
| Кнопка ручного обновления цен                  | 🔴        |
| Форма добавления актива (`POST /assets`)       | 🔴        |
| Операции BUY/SELL/ADJUSTMENT                   | 🔴        |
| Валидация тикера (`GET /instruments/validate`) | 🔴        |

### Не входит в MVP

| Требование                              |
| --------------------------------------- |
| Карточка актива с историческим графиком |
| Аналитика категорий и drill-down        |
| Источники хранения (управление)         |
| Управление подкатегориями               |
| Настройки профиля                       |
| Realized PnL                            |
| IndexedDB-кэш (после бэкенда)           |
| Экспорт CSV                             |
| Уведомления Telegram                    |

---

## 14. Переменные окружения

| Переменная          | Назначение          | Пример                       |
| ------------------- | ------------------- | ---------------------------- |
| `REACT_APP_API_URL` | Базовый URL бэкенда | `http://localhost:8080`      |
| `REACT_APP_ENV`     | Окружение           | `development` / `production` |
