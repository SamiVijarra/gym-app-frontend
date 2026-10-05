# Gym App — Web client 🏋️‍♀️

React web app for tracking workouts: build routines, plan sessions, log what you lifted and watch your progress on a color-coded calendar.

API repository: [gym-app backend](https://github.com/SamiVijarra/gym-app)

## Features

- **Exercise catalog**: search, view details and create your own exercises.
- **Routines**: training days with exercises and sets. Finishing a session keeps the routine up to date with your latest numbers.
- **Calendar** with a month view and a day view:
    - plan a routine day, or a **free session** by picking exercises ahead of time;
    - log a session on the spot, or complete a planned one;
    - **color marks per muscle group** on each day, with a legend.
- **Pick exercises by muscle group**: choose Chest, Back, Glutes... see only those exercises, add them, then switch group to add more.
- **Progress**: per-exercise chart (max weight or total volume), monthly stats, weekly goal and a weekly streak on the home page.
- **Light and dark theme**, responsive layout with a collapsible sidebar on desktop and a drawer on mobile.
- Confirmation dialogs before every delete, and field-level validation on most forms.

## Stack

React 19, Vite, Redux Toolkit, React Router 6, styled-components, TypeScript (migrating gradually, `allowJs`), Axios, Recharts, date-fns, SweetAlert2.

## Getting started

Requirements: Node.js 20+ and the API running (see the API repository).

```bash
npm install
cp .env.template .env      # set VITE_API_URL to the API address
npm run dev
```

| Variable       | Description                                              |
| -------------- | -------------------------------------------------------- |
| `VITE_API_URL` | Base URL of the API, for example `http://localhost:3000` |

The API must allow this origin in its `CORS_ORIGIN` setting (Vite runs on `http://localhost:5173` by default).

## Scripts

| Command           | What it does                       |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Development server                 |
| `npm run build`   | Production build into `dist/`      |
| `npm run preview` | Serve the production build locally |
| `npm run lint`    | ESLint                             |

## How it is organized

```
src/
  api/          Axios instance (adds the token, logs out on an expired session)
  auth/         login and registration
  calendar/     month and day pages, session builder, exercise picker, muscle group colors
  exercises/    catalog, detail and progress chart
  routines/     routine days and their exercises
  home/         dashboard with stats and quick access
  components/   shared UI: Button, Card, FormField, ToggleGroup, Sidebar, Layout...
  hooks/        one hook per feature that talks to the store and the API
  store/        Redux slices
  theme.ts      design tokens for styled-components
```

## Design notes

- **Design system.** Colors, spacing and radius are CSS variables with a light and a dark theme. New UI is built with styled-components on top of a small component library, replacing duplicated CSS.
- **Pages load on demand.** Routes are code-split, so the first load is a lot smaller than a single bundle. The chart library is only downloaded when you open an exercise's progress page.
- **Session expiry.** An Axios interceptor logs the user out when the API answers 401 on a protected route.
- **Muscle group colors** are defined in `src/calendar/muscleGroups.ts` and must match the keys used by the API.
