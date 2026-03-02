# AGENTS.md — signal-note

Korean stock market data dashboard built with Next.js 15 App Router, React 19, Tailwind CSS v4, and Bun.

## Build & Run

```bash
bun install                  # Install dependencies
bun run dev                  # Dev server at localhost:3000
bun run build                # Production build (next build)
bun run lint                 # ESLint (next/core-web-vitals + next/typescript)
bun run test                 # Run all tests (vitest)
bun vitest run               # Run tests once (no watch)
bun vitest run src/__tests__/format.test.ts          # Single test file
bun vitest run -t "formatKRW"                        # Single test by name
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages (default: server components)
    stock/[slug]/         # Dynamic stock detail route
    globals.css           # Tailwind v4 theme + CSS custom properties
    layout.tsx            # Root layout (fonts, metadata, Kakao SDK)
    page.tsx              # Home dashboard
  components/
    charts/               # Recharts-based chart components (client)
    layout/               # Header, Footer, PageContainer, CTABanner
    share/                # ShareButtons (client — Kakao, X, clipboard)
    ui/                   # Primitives: Card, ChangeBadge, MetricBadge, Logo, etc.
  data/
    companies/            # Static JSON data files per company
    schema.ts             # Domain types (CompanyData, CompanyMetrics, etc.)
  lib/                    # Pure utility functions (format, data access, constants)
  types/                  # Ambient type declarations (.d.ts)
  __tests__/              # Vitest test files (*.test.ts)
  fonts/                  # Local font files (Pretendard)
```

## Code Style

### Formatting
- **Double quotes** everywhere (strings, JSX attributes, imports)
- **Semicolons** always
- **2-space indentation**
- **Trailing commas** in multi-line objects/arrays
- No prettier config — match existing style manually

### Imports
- Always use `@/` path alias (maps to `src/`). Never use relative paths like `../`
- Use `import type { X }` for type-only imports
- Order: external packages first, then `@/` imports, alphabetically within groups
- Example:
  ```ts
  import type { Metadata } from "next";
  import Link from "next/link";
  import { ArrowUpRight } from "lucide-react";
  import { Card } from "@/components/ui/Card";
  import { SITE_SETTINGS } from "@/lib/constants";
  import { formatCompactKRW } from "@/lib/format";
  ```

### Naming
- **Components**: PascalCase files and function names (`Card.tsx` → `export function Card()`)
- **Lib/utilities**: lowercase or camelCase files (`format.ts`, `site-url.ts`, `constants.ts`)
- **Constants**: `SCREAMING_SNAKE_CASE` for module-level values, with `as const`
- **Types**: PascalCase (`CompanyData`, `MarketType`, `ISODateString`)
- **Interfaces**: PascalCase with Props suffix for component props (`CardProps`, `ChangeBadgeProps`)
- **Test files**: `*.test.ts` in `src/__tests__/`

### Components
- **Functional components only** — no class components
- **Named exports** for all components: `export function Card() {}`
- **Page components**: `export default function` (Next.js convention)
- **Props**: Extend `HTMLAttributes<HTMLDivElement>` where applicable, destructure with rest spread
- **Client components**: Add `"use client"` directive at top of file (only when hooks/browser APIs needed)
- **Server components**: Default — no directive needed

### CSS / Styling
- **Tailwind CSS v4** with `@theme` directive in `globals.css`
- **CSS custom properties** for theming (`--color-accent`, `--surface-background`, etc.)
- **Class composition**: Use array + `.filter(Boolean).join(" ")` pattern — no clsx/cn:
  ```ts
  const classes = ["base-class", conditional && "conditional-class", className]
    .filter(Boolean)
    .join(" ");
  ```
- **Custom utilities**: `.fin-num` for tabular numeric display, `.text-up` / `.text-down` / `.text-neutral`
- Dark mode via `data-theme="dark"` attribute, not Tailwind's built-in dark mode

### Types
- **Interfaces** for component props and structured objects with methods
- **Type aliases** for unions, primitives, and simple shapes (`type MarketType = "KOSPI" | "KOSDAQ"`)
- **Domain types** centralized in `src/data/schema.ts`
- **Component props** co-located in same file
- **Ambient declarations** in `src/types/*.d.ts`
- **Strict mode** enabled in tsconfig

### Functions & Error Handling
- Accept nullable params (`number | null | undefined`) and return safe fallbacks (`"—"`)
- Guard with early returns:
  ```ts
  if (!isNumber(value)) {
    return "—";
  }
  ```
- Handle `-0` explicitly with `Object.is(value, -0)`
- `console.warn("[ComponentName] message", error)` for non-critical failures
- `try/catch` with fallback behavior — never let errors propagate to crash UI

### Data Patterns
- Static JSON imports for company data — no API routes, no database
- Data access through `src/lib/data.ts` (`getCompany`, `getAllCompanies`, `getAllSlugs`)
- No external state management — local `useState`/`useEffect` only
- Server components render data directly; client components for interactivity only

## Testing

- **Framework**: Vitest with globals enabled (`describe`, `it`, `expect` — no imports needed)
- **Location**: `src/__tests__/*.test.ts`
- **Path alias**: `@/` works in tests (configured in vitest.config.ts)
- **Pattern**: `describe("module name", () => { it("behavior description", () => { ... }) })`
- **Coverage**: Tests cover utility functions and data access — not React components
- Test null/undefined edge cases explicitly

## Key Dependencies

| Package | Purpose |
|---------|---------|
| next 15 | App Router framework |
| react 19 | UI library |
| tailwindcss v4 | Styling via `@tailwindcss/postcss` |
| recharts | Charts (RevenueChart, PriceSparkline) |
| lucide-react | Icons |
| vitest | Test runner |
| @testing-library/react | React testing utilities (available but unused currently) |
| babel-plugin-react-compiler | React Compiler (dev) |

## Environment Variables

Defined in `.env.example`:
- `NEXT_PUBLIC_SITE_URL` — canonical site URL (falls back to `http://localhost:3000`)
- `NEXT_PUBLIC_KAKAO_JS_KEY` — Kakao SDK JavaScript key for social sharing

## Gotchas

- This project uses **Bun** as package manager — use `bun` commands, not npm/yarn/pnpm
- Tailwind v4 uses `@theme` and `@custom-variant` syntax — different from v3
- Dark mode toggles `data-theme` attribute, not CSS class — see `globals.css`
- Korean locale (`ko-KR`) used for number formatting throughout
- Financial numbers use `fin-num` utility class for tabular alignment
- `as const` assertions used extensively for readonly data
