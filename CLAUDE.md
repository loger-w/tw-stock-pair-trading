# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taiwan Stock Pairs Trading Analysis System (台股雙刀戰法分析系統) - A frontend-only pairs trading analysis tool for Taiwan stocks. The system identifies arbitrage opportunities when two stocks in the same sector diverge in price, suggesting to short the relatively strong stock and long the relatively weak stock.

## Commands

```sh
npm run dev        # Dev server on port 3000
npm run build      # vite build + tsc (both must pass)
npm run lint       # ESLint check
npm run format     # ESLint --fix (handles formatting — no separate Prettier config)
npm run test       # Vitest
npm run preview    # Preview production build
```

## Build Constraints

- `tsconfig.json` has `noUnusedLocals: true` and `noUnusedParameters: true`. Any unused import, variable, or destructured element is a **hard compile error** that breaks `npm run build`. Delete unused code — do not comment it out.
- `npm run build` runs `vite build && tsc` sequentially — both the bundle and the type check must pass.
- `src/routeTree.gen.ts` is **auto-generated** by the TanStack Router Vite plugin. Never edit it manually.

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite 7
- **Framework**: React 19
- **UI**: Tailwind CSS v4 + Shadcn UI (new-york style, config in `components.json`)
- **Charts**: ApexCharts (`react-apexcharts`)
- **State Management**: React hooks (component-level), Zustand (cross-component)
- **Data Fetching**: TanStack Query v5 (with caching)
- **Routing**: TanStack Router (file-based, routes live in `src/routes/`)
- **Local Storage**: IndexedDB via `idb` library
- **Toast Notifications**: Sonner
- **Code Quality**: ESLint (`@tanstack/eslint-config`)
- **Path alias**: `@/` resolves to `./src/`

## Architecture

### Layout & Routing

The app is a single-page two-pane layout: `Sidebar` (left) + `MainContent` (right). The root route (`src/routes/__root.tsx`) wires up `QueryClientProvider`, `Toaster`, and this layout. Currently one page route (`/` → `PairsOverview`). To add a new route, create a file under `src/routes/` — the Vite plugin auto-generates `routeTree.gen.ts`.

### Data Flow

```
User clicks "Calculate"
  → PairsOverview.handleCalculate()
    → fetchStockPrices()          — api.ts (mock or FinMind, cached by TanStack Query)
    → usePairCalculation()        — hook
      → lib/calculations.ts       — pure math (ratios, stats, position sizing)
      → lib/signals.ts            — signal classification + trading action
    → results stored in React state, rendered as PairCards
```

### Mock vs Real API

`src/services/api.ts` has a `USE_REAL_API` flag (currently `false`). When false, all price data comes from `src/services/mockData.ts` which generates deterministic seeded data. To switch to the real FinMind API, set `USE_REAL_API = true` and fill in `FINMIND_TOKEN`.

### TWSE_stocks.json (509 KB)

The full Taiwan stock catalog lives in `src/data/TWSE_stocks.json`. This file is **lazy-loaded** via dynamic `import()` inside `useStockSearch.ts` to avoid bundling it into the initial chunk. Do not revert this to a static import — it would exceed Vite's 500 KB chunk size warning limit on its own.

## Data Source

Primary: FinMind Open Data API
- Endpoint: `https://api.finmindtrade.com/api/v4/data`
- Dataset: TaiwanStockPrice (includes adjusted prices)

## Core Modules

### Module A: Stock Group Management (Sidebar)
- Create/delete groups with up to 5 stocks each
- Minimum 2 stocks required to enable analysis
- Groups persisted in IndexedDB

### Module B: Pairs Overview (Main Feature)
- Auto-generates all directional pairs: N stocks = N×(N-1) pairs
- Signal strength based on arbitrage space and Z-Score
- "Calculate" button triggers analysis (not automatic)

### Module C: Single Pair Detail Analysis
- Price ratio statistics and charts
- Price ratio trend chart with ±2 standard deviation bands
- Dual-axis stock price comparison chart

### Module D: Position Calculator
- Minimum capital mode: finds smallest lot combination
- Custom capital mode: user inputs total capital for position sizing

## Key Calculations

- **Price Ratio**: Stock A adjusted price ÷ Stock B adjusted price
- **Arbitrage Space**: (Current price ratio ÷ Historical mean) - 1
- **Z-Score**: (Current price ratio - Historical mean) ÷ Historical standard deviation
- **Co-movement Rate**: Percentage of days both stocks moved in same direction

## Signal Strength Rules

| Arbitrage Space (abs) | Z-Score (abs) | Signal Level |
|----------------------|---------------|--------------|
| ≥20%                 | ≥2.0          | Super Strong |
| ≥15%                 | ≥2.0          | Strong       |
| ≥15%                 | 1.5~2.0       | Medium       |
| 10%~15%              | ≥2.0          | Medium       |
| <10%                 | any           | None         |

## Color Conventions (Taiwan Market)

- **Up/Long**: Red (#dc2626)
- **Down/Short**: Green (#16a34a)
- **Strong Signal**: Red (#dc2626)
- **Medium Signal**: Orange-yellow (#f59e0b)
- **Weak/None Signal**: Gray (#9ca3af)
- **Primary**: Dark blue (#1e3a5f)

## State Management

| Data Type | Storage | Persistence |
|-----------|---------|-------------|
| Groups & Stocks | IndexedDB | Persistent |
| Stock Prices | TanStack Query Cache | Session only |
| Calculation Results | React State | None |
| Selected Group | Zustand | Session only |
| Analysis Period | Zustand | Session only |

# Code style

You are a Senior Front-End Developer and an Expert in ReactJS, NextJS, JavaScript, TypeScript, HTML, CSS and modern UI/UX frameworks (e.g., TailwindCSS, Shadcn, Radix). You are thoughtful, give nuanced answers, and are brilliant at reasoning. You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

- Follow the user's requirements carefully \& to the letter.
- First think step-by-step - describe your plan for what to build in pseudocode, written ut in great detail.
- Confirm, then write code!
- Always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules down below at Code Implementation Guidelines .

- Focus on easy and readability code, over being performant.
- Fully implement all requested functionality.
- Leave NO todo's, placeholders or missing pieces.
- Ensure code is complete! Verify thoroughly finalised.
- Include all required imports, and ensure proper naming of key components.
- Be concise Minimize any other prose.
- If you think there might not be a correct answer, you say so.
- If you do not know the answer, say so, instead of guessing.

### Code Implementation Guidelines

Follow these rules when you write code:

- Use early returns whenever possible to make the code more readable.
- Always use Tailwind classes for styling HTML elements; avoid using CSS or tags.
- Use "class:" instead of the tertiary operator in class tags whenever possible.
- Use descriptive variable and function/const names. Also, event functions should be named with a "handle" prefix, like "handleClick" for onClick and "handleKeyDown" for onKeyDown.
- Implement accessibility features on elements. For example, a tag should have a tabindex="0", aria-label, on:click, and on:keydown, and similar attributes.
- Use consts instead of functions, for example, "const toggle = () =>". Also, define a type if possible.
- 始終回覆我中文