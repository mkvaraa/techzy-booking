# Techzy Rooms — Meeting Room Booking

An internal web application for company employees to browse meeting rooms, check
availability, and manage bookings. Built with React + TypeScript. No backend is
required — data is seeded from local JSON and persisted in the browser.

## Features

- **Dashboard** — at-a-glance metrics (rooms free now, meetings today, my
  upcoming meetings), today's schedule, and live room availability.
- **Rooms** — searchable, filterable room catalog (by type, building, capacity,
  amenities) with a details page and per-room schedule.
- **Calendar / Schedule** — day and week views powered by `react-big-calendar`,
  filterable by room. Click an event to view details, click an empty slot to
  create a booking.
- **Bookings** — sortable table with search and filters (room, organizer,
  status, time scope, "my bookings"). Create, view, edit, and cancel bookings.
- **Booking form** — validated with `react-hook-form` + `yup`, with live
  double-booking (overlap) detection.
- **Persistence** — all changes survive a page refresh (localStorage).
- **URL state** — filters, calendar view/date, and the selected booking are
  reflected in the URL and are shareable/deep-linkable.
- **Responsive** and light/dark theme aware.

## Tech stack

- React 19, TypeScript, Vite
- Tailwind CSS v4 + shadcn/ui components
- TanStack Query (data fetching/caching), Zustand (current user + UI state)
- React Router (routing + URL state)
- react-hook-form + yup (forms/validation)
- date-fns, react-big-calendar

## Architecture

The UI never touches the JSON files directly. Instead it goes through a data
layer that mimics a REST API, so the local source can later be swapped for a
real API without rewriting the UI.

```
JSON seed  ─►  localStorage ("db")  ◄─►  mock API (async)  ◄─►  TanStack Query  ─►  UI
```

- `src/data/*.json` — initial seed data (rooms, employees, bookings). Bookings
  are stored as offsets relative to the current week so the demo always has
  relevant data; they are materialized into ISO datetimes on seed.
- `src/api/db.ts` — seeds and reads/writes localStorage (with a schema version
  to trigger re-seeding).
- `src/api/{rooms,bookings,employees}.ts` — the "API": async functions with
  simulated latency and domain validation (e.g. overlap conflicts).
- `src/hooks/*` — TanStack Query hooks (`useRooms`, `useBookings`, mutations,
  etc.) that are the only thing components use to read/write data.
- `src/features/*` — feature pages and components (dashboard, rooms, calendar,
  bookings).

To replace the mock with a real backend, reimplement `src/api/*` with `fetch`
calls; the hooks and UI stay the same.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Use the employee switcher in the top-right to act as different employees (this
determines "my bookings" and who can edit/cancel a booking). "Reset demo data"
in that menu restores the original seed data.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run typecheck` — TypeScript only
- `npm run lint` — ESLint
- `npm run preview` — preview the production build

## Deployment (Vercel)

This is a client-side SPA. `vercel.json` rewrites all routes to `index.html` so
client-side routing works on refresh/deep links.
