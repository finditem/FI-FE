# Gemini Code Assist Style Guide

## Language

Please provide all code reviews, pull request summaries, and help messages in Korean (한글).

- Maintain a **helpful, supportive, and friendly** tone in communication.
- However, **do not use emojis** in any review comments.

## Introduction

This style guide outlines the coding conventions for frontend code developed in this repository.  
The project is based on **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**.  
Gemini Code Assist should use this guide when reviewing code, summarizing pull requests, and suggesting improvements.

## Tech Stack Context

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS (with clsx)
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query) v5
- **Form Management:** React Hook Form & Zod
- **Testing/Documentation:** Storybook, Jest, React Testing Library, MSW, Playwright
- **Animations:** Framer Motion

## General Review Rules

- **Do not leave code review comments on pull requests targeting `main` or `release` branches.**
- Provide all review comments in **Korean**.
- Be concrete and actionable.
- Point out incorrect assumptions, weak logic, and risky implementation details clearly.
- Do not suggest unnecessary abstractions when the current implementation is simple and sufficient.
- Prefer practical improvements over theoretical perfection.
- When reviewing, prioritize:
  1. Correctness
  2. Readability
  3. Maintainability
  4. Performance
  5. Consistency

## Project Directory & Architecture

- **`src/components/common`**: Reusable generic components (e.g., Buttons, Inputs).
- **`src/components/domain`**: Feature/Domain-specific components.
- **`src/components/layout`**: Layout-related components.
- **`src/components/state`**: State-specific components (e.g., Loading, Error).
- **`src/api/fetch/{domain}`**: Domain-specific API hooks and types.
- **`src/store/useXStore`**: Zustand store modules.
- **`src/hooks/domain`**: Domain-specific custom hooks.
- **`src/app/(group)`**: Next.js App Router folders with route grouping.

## TypeScript & Naming Protocols

### Type Safety

- **Use TypeScript types explicitly.** Avoid `any`.
- Prefer `unknown` when types are unclear.
- Use shared domain types in `src/types` or `src/api/fetch/{domain}/types`.

### Naming Conventions

- **Variables/Functions**: `camelCase`
- **Components/Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**:
  - Components: `ComponentName.tsx`
  - Hooks: `useHookName.ts`
  - Constants: `constantName.ts`

## React & Components

### Component Structure

- **Prefer arrow functions** for components.
- Do **not** use `React.FC`. Use standard function generic or direct prop typing.
- Use JSDoc for complex/reusable components (Refer to `src/components/common/Buttons/Button/Button.tsx`).
- Keep components focused on one responsibility.

### Rules for Client/Server Components

- Use **Server Components** by default for SEO and performance.
- Use `"use client"` only for interactivity, hooks, or browser-only APIs.
- Keep the "use client" boundary as small as possible.

## Data Fetching & API (TanStack Query)

- **Do not use `useQuery` directly** in components if a domain-specific wrapper exists.
- **Pattern:**
  1. Define types in `src/api/fetch/{domain}/types`.
  2. Implement custom hooks in `src/api/fetch/{domain}/api` using `useAppQuery` or `useAppMutation` (from `src/api/_base/query`).
  3. Export them from `src/api/fetch/{domain}/index.ts`.
- **Query Keys**: Use consistent arrays for query keys (e.g., `["/domain", id]`).

## State Management (Zustand)

- Place stores in `src/store/useXStore/useXStore.ts`.
- Keep state management minimal and local unless global sharing is strictly required.

## Styling (Tailwind CSS)

- Use **Tailwind utility classes** via `clsx` or string concatenation.
- Avoid arbitrary values (`h-[123px]`) unless absolutely necessary.
- Respect the design system defined in `tailwind.config.js`.

## Form & Validation (RHF + Zod)

- Use **React Hook Form** for form state.
- Use **Zod schemas** for validation and API response validation.
- Keep validation logic outside of components when possible.

## Testing & Storybook

- **Storybook**: Add `.stories.tsx` for all generic components in `src/components/common`.
- **Jest/RTL**: Write unit tests for business logic and critical UI paths.
- **Playwright**: Use for E2E testing on critical flows.

## Error Handling

- Use `ErrorBoundary` for catching rendering errors.
- Handle API errors gracefully via `useErrorToast` or TanStack Query's `onError` (or custom wrapper logic).
- Show user-friendly error messages (e.g., using `SnackBar` or `Toast`).

## Code Documentation

- Write comments on **why** (rationale), not **what** (self-explanatory code).
- Use **JSDoc** for shared utilities, components, and hooks.
- Reference example:
  ```tsx
  /**
   * @param props - Description
   * @example
   * <Component prop="value" />
   */
  ```

## Imports

- Use **Absolute Imports** via `@/` alias.
- Group imports:
  1. React/Next.js/External Libraries
  2. Internal Aliases (`@/`)
  3. Assets/Styles/Relative Imports

## Preferred Review Style

- Provide all review comments in **Korean**.
- Maintain a **helpful, supportive, and friendly** tone.
- **Do not use emojis** in any review comments.
- Be direct and specific.
- Suggest a better approach when there is a clear improvement.
- Do not praise unnecessarily.
- Do not make vague comments such as "consider improving this."
- Explain what is wrong, why it matters, and how it can be improved.

---

_This guide is subject to change as the project evolves._
