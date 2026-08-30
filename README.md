# Techzy Rooms — Meeting Room Booking System

<p align="center">
  <strong>A modern, enterprise-ready web application for meeting room reservations and workplace scheduling.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=react-query&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-Components-000000?style=flat-square&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</p>

---

## 📌 Overview

**Techzy Rooms** is an internal Single Page Application (SPA) designed for corporate employees to browse meeting spaces, check real-time availability, schedule meetings, and manage room bookings with zero friction.

The application is completely standalone and requires **no external backend** to run: data is seeded from JSON, materialized dynamically relative to the current week, and persisted in browser storage (`localStorage`) through a decoupled, production-ready API abstraction layer.

---

## ✨ Key Features

### 📊 Dashboard

- **Live Metrics**: Instantly view rooms available right now, today's total meetings, upcoming personal meetings, and total company spaces.
- **Today's Schedule Widget**: Quick chronological overview of meetings scheduled for today with one-click detail inspection.
- **Room Availability Widget**: Real-time room status indicators with dynamic timers (`Free till 14:00`, `Busy till 15:30`).
- **My Upcoming Bookings**: Filtered view of meetings where the active user is an organizer or an attendee.

### 🏢 Room Directory

- Search and filter rooms by keyword, room type (meeting, conference, boardroom, huddle, phone booth, training), building, minimum capacity, and available amenities (Wi-Fi, projector, whiteboard, video conferencing, catering, etc.).
- Visual status cards with live `Free now` / `Busy now` / `Unavailable` badges.
- Dedicated room details page with image gallery, specifications, and per-room booking timeline.

### 📅 Interactive Calendar & Schedule

- Full **Day** and **Week** views powered by `react-big-calendar`.
- Filter schedule by specific meeting rooms or view all rooms simultaneously.
- **Click-to-book**: Select any empty time slot directly on the calendar grid to open the booking modal with prefilled room and time range.
- Click any meeting event to view comprehensive meeting details.

### 📋 Bookings Management

- Sortable table with column sorting (by date/time, meeting title, room).
- Advanced multi-criteria filters: full-text search, room selector, organizer selector, status (`confirmed` / `cancelled`), time scope (`upcoming` / `past` / `all`), and a quick "My bookings" toggle.
- Full lifecycle management: view details, edit meeting parameters, and cancel reservations with confirmation dialogs.

### 🛡️ Smart Booking Form

- Controlled form validation powered by `react-hook-form` + `yup`.
- **Live Conflict Detection**: Real-time overlapping booking check that alerts the user and prevents double-booking before submission.
- Attendee picker with search, multi-selection, and automatic exclusion of the meeting organizer.

### 👤 User Persona Switcher

- Instant switcher in the header to act as different employees.
- **Role & Ownership Enforcement**: Only the meeting organizer has permissions to edit or cancel a reservation.
- **Reset Demo Data**: Easily restore original seed data at any time.

### 🔗 Deep Linking & URL State

- All filter parameters, sorting choices, selected booking dialogs (`?booking=id`), and calendar view/dates are synchronized with URL search parameters. URLs are fully shareable, bookmarkable, and respect browser history navigation.

### 🎨 Theme & Accessibility

- Seamless dark and light theme switching via `next-themes` and CSS variables.
- Responsive layout supporting mobile devices, tablets, and wide monitors.
- Graceful loading states with animated skeletons and dedicated empty state placeholders.

---

## 🛠️ Tech Stack

| Category                    | Technologies                                                         |
| :-------------------------- | :------------------------------------------------------------------- |
| **Core Framework**          | React 19, TypeScript, Vite                                           |
| **Styling & Design System** | Tailwind CSS v4, shadcn/ui, Radix UI, Lucide Icons, `tw-animate-css` |
| **Server State & Cache**    | TanStack Query v5 (React Query)                                      |
| **Client State**            | Zustand (active user session, global dialog state)                   |
| **Routing & URL State**     | React Router v7                                                      |
| **Forms & Validation**      | React Hook Form, Yup, `@hookform/resolvers`                          |
| **Date & Calendar**         | `react-big-calendar`, `date-fns`                                     |
| **Toast Notifications**     | Sonner                                                               |

---

## 🏗️ Architecture

The UI never communicates directly with raw storage or JSON files. Instead, it follows a clean layered architecture with a simulated asynchronous API:

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐
│  JSON Seeds  │ ──► │ localStorage (DB) │ ◄─► │  Mock API Layer  │
└──────────────┘     └───────────────────┘     │ (latency & rules)│
                                               └────────┬─────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ UI / Components │ ◄── │  React Router   │ ◄── │  TanStack Query  │
│ (Feature-based) │     │   (URL State)   │     │ (Caching/Hooks)  │
└─────────────────┘     └─────────────────┘     └──────────────────┘
```

- **`src/data/*.json`** — Initial seed data (rooms, employees, bookings stored as week offsets `dayOffset`).
- **`src/api/db.ts`** — Local persistence layer with schema versioning (`SCHEMA_VERSION`) and dynamic date materialization.
- **`src/api/{bookings,rooms,employees}.ts`** — Asynchronous API modules with artificial latency simulation (`delay`), ID generation, and domain validations.
- **`src/hooks/*`** — TanStack Query hooks (`useBookings`, `useRooms`, mutations) providing caching, background refetching, and automated cache invalidation.
- **`src/features/*`** — Modular feature domain slices (`bookings`, `rooms`, `calendar`, `dashboard`).

> 💡 **Connecting a Real Backend**: To transition to a production REST/GraphQL API, simply replace the implementations in `src/api/*` with `fetch`/`axios` calls. All hooks, state management, and UI components remain completely untouched.

---

## 📁 Project Structure

```text
src/
├── api/              # API layer (db.ts, client.ts, bookings.ts, rooms.ts, employees.ts)
├── components/
│   ├── common/       # Shared presentation components (EmptyState, PageHeader, PageFallback, Avatar)
│   ├── layout/       # Shell components (AppShell, Header, Sidebar, UserSwitcher, ThemeToggle)
│   └── ui/           # Reusable shadcn/ui primitives (Button, Dialog, Select, Table, Input, etc.)
├── data/             # Initial JSON seeds
├── features/
│   ├── bookings/     # Bookings feature (table, filters, dialogs, form)
│   ├── calendar/     # Interactive schedule calendar and localizer
│   ├── dashboard/    # Dashboard widgets, stats cards, live availability
│   ├── misc/         # 404 Not Found page
│   └── rooms/        # Rooms catalog and room details
├── hooks/            # TanStack Query custom hooks and lookup utilities
├── lib/              # Pure domain logic (availability check, date utilities, status helpers, validation)
├── pages/            # Page route wrappers
├── router/           # React Router configuration and lazy page definitions
├── store/            # Zustand stores (userStore, bookingDialogStore)
├── styles/           # Stylesheets (calendar overrides)
└── types/            # TypeScript interfaces, DTOs, and domain models
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation & Development

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/techzy-booking.git
   cd techzy-booking
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the local development server**:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## 📜 Available Scripts

| Script              | Purpose                                                                    |
| :------------------ | :------------------------------------------------------------------------- |
| `npm run dev`       | Starts the Vite dev server with Hot Module Replacement (HMR)               |
| `npm run build`     | Runs TypeScript type checking and builds the production bundle into `dist` |
| `npm run typecheck` | Executes TypeScript compiler in check-only mode (`tsc --noEmit`)           |
| `npm run lint`      | Lints project files with ESLint                                            |
| `npm run format`    | Automatically formats all TypeScript and TSX files using Prettier          |
| `npm run preview`   | Locally serves the production build for testing                            |

---

## 🌐 Deployment

This application is configured as a client-side Single Page Application (SPA). A `vercel.json` file is included with rewrite rules routing all requests to `index.html`, ensuring seamless client-side routing on page refresh and direct URL navigation.

It can be deployed in one click to platforms such as **Vercel**, **Netlify**, or **Cloudflare Pages**.
