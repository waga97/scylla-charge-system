# Supersharkz Charge Management System

A single-page charge recording system for Supersharkz Swim School. Admins can create, view, edit, and delete student charge records — all from one screen.

## Table of Contents

- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Assumptions](#assumptions)
- [Trade-offs](#trade-offs)
- [What I Would Improve Next](#what-i-would-improve-next)
- [UX Reflection](#ux-reflection)
- [Deletion Handling](#deletion-handling)

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## Tech Stack

- React 19 + TypeScript (Vite)
- Tailwind CSS v4 for styling
- Zod v4 for schema validation
- ESLint + Prettier for code quality

## Project Structure

```
src/
  types/          — TypeScript interfaces and type definitions
  schemas/        — Zod validation schemas
  utils/          — Currency formatting, ID generation
  mocks/          — Stub data and mock API handlers (localStorage)
  services/       — API service abstraction layer
  hooks/          — Custom React hooks (useCharges)
  components/
    ui/           — Reusable UI primitives (Modal)
    charges/      — Feature-specific components (Table, Form, Row, etc.)
  App.tsx         — Root component and page orchestrator
```

The mock layer sits behind `services/chargeService.ts`, completely separate from the UI. If you ever need to wire this up to a real backend, you'd only touch that one file — nothing in the components or hooks needs to change.

## Assumptions

- This is meant for a small admin team at one swim school, so I kept state management simple with `useState` and a custom hook rather than pulling in a library like Redux or Zustand.
- Charge IDs are auto-generated (e.g. `chg_001`) and can't be edited by the user. Financial record IDs should be system-controlled to avoid duplicates or human error.
- Everything is in MYR. The outstanding amount is always calculated on the fly from `charge_amount - paid_amount` — it's never stored separately, so it can't get out of sync.
- The 5 stub records from the assessment spec get seeded on first load and saved to localStorage to mimic what a real server would do.
- Dates can't be set in the future, since charges should only reflect transactions that have actually happened.

## Trade-offs

- I went with localStorage instead of a real API to stay within the time limit. That said, the service layer is set up so swapping in a real backend later is literally a one-file change.
- I picked `useState` over `useReducer`. For just four CRUD operations, `useReducer` felt like overkill — `useState` keeps things readable and gets the job done.
- No tests in this submission due to the 3-hour scope. If this were production code, I'd at minimum cover the Zod validation, currency utils, and the `useCharges` hook with unit tests.
- Tailwind classes are inline rather than extracted into CSS modules. For a small single-page app like this, having styles right next to the markup actually makes it easier to read. In a bigger codebase I'd set up a proper component library.

## What I Would Improve Next

- A student ledger view — click a student ID and see their full charge history. The architecture already supports this since we can filter all charges by `student_id` on the client side.
- An optional notes field on each charge for context like "late payment" or "partial refund."
- Pagination or virtual scrolling once the charge list grows past a few hundred records.
- Unit tests for the schemas, utility functions, and the `useCharges` hook.
- Keyboard shortcuts for power users (e.g. `N` for new charge). Escape-to-close on modals is already there.

## UX Reflection

Three realistic mistakes a non-technical admin might make, and how the UI helps prevent them:

1. Typing a paid amount that's bigger than the charge. Say an admin enters RM 500 paid on a RM 300 charge — easy copy-paste mistake. The form catches this with a cross-field validation rule and shows a clear error right below the paid amount field before anything gets saved.

2. Picking a future date by accident. An admin recording yesterday's charge might accidentally select tomorrow. The date field won't allow any date past today, so incorrect records can't sneak in.

3. Entering negative or zero amounts. Someone might type `-50` or `0` for a charge by mistake. The form requires charge amounts to be positive and paid amounts to be zero or above, with a specific message explaining what went wrong.

## Deletion Handling

When an admin hits the delete button, a modal pops up showing exactly what they're about to remove — the charge ID, student, amount, and date. But the delete button inside the modal starts out disabled. To actually go through with it, they have to type the word `DELETE` into a confirmation input first.

I went with this approach because charge records are financial data — accidentally deleting one has real consequences. A basic "Are you sure?" dialog is too easy to click through without thinking. The type-to-confirm pattern (borrowed from GitHub and AWS) adds just enough friction that someone has to consciously decide to proceed. On top of that, the button disables itself while the deletion is processing, so there's no risk of double-clicking and accidentally removing multiple records.
