# Finance Dashboard

A responsive finance dashboard built with React, TypeScript, Vite, and Tailwind CSS.

This project was completed as a frontend assessment. It focuses on clear UI structure, responsive design, modular React architecture, and realistic client-side data handling through a fake API layer.

## Live Demo

[View Deployment](https://finance-dashboard-euf7-nydthwwnr-generator07s-projects.vercel.app/)

## Features

- Dashboard summary cards for balance, income, and expenses
- Balance trend line chart
- Category breakdown pie chart
- Financial insights section
- Transaction list with:
  - search
  - filtering
  - sorting
  - CSV export
  - add transaction
  - edit transaction
  - delete transaction
- Role-based UI behavior for `admin` and `viewer`
- Sticky responsive header
- Dark and light theme support
- System theme used by default until the user overrides it
- Local persistence using `localStorage`
- Fake API-based CRUD flow for transactions

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Recharts
- Lucide React

## Project Structure

```text
src/
  api/          Fake API layer and local storage helpers
  components/   Reusable UI and dashboard components
  context/      React context definitions
  hooks/        Custom hooks
  providers/    App-level providers
  types/        Shared TypeScript types
  utils/        Calculation and mock-data utilities
```

## Data Flow

- On app startup, the finance provider checks `localStorage` first.
- If transaction data already exists, it hydrates the app state immediately.
- If no data exists, the app falls back to the fake transaction API.
- Transaction create, update, and delete actions go through the fake API layer.
- The fake API persists transaction changes to `localStorage`.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or npm

### Install

```bash
pnpm install
```

If you use npm:

```bash
npm install
```

### Run the development server

```bash
pnpm dev
```

Or:

```bash
npm run dev
```

### Build for production

```bash
pnpm build
```

Or:

```bash
npm run build
```

### Preview production build

```bash
pnpm preview
```

## Available Scripts

- `pnpm dev` or `npm run dev` - start the development server
- `pnpm build` or `npm run build` - type-check and build the app
- `pnpm preview` or `npm run preview` - preview the production build
- `pnpm lint` or `npm run lint` - run ESLint
- `pnpm typecheck` or `npm run typecheck` - run TypeScript type checking

## Notes

- This project does not use a real backend.
- Transaction data is persisted locally for demo purposes.
- Charts are rendered from frontend-derived data based on the fetched transaction set.

## Future Improvements

- Add a real backend API
- Add authentication and real role-based authorization
- Add pagination or virtualization for very large transaction lists
- Add automated tests
- Add stronger chart and interaction accessibility support
