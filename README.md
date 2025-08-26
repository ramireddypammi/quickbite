# QuickBite

A modern full‑stack food delivery platform. Users can browse restaurants, filter menus, add items to cart, checkout, and track orders. Admins can manage restaurants and menu items.

## Features
- User signup/login with role‑based access (user/admin)
- Restaurant browsing, categories, and searchable menu
- Cart with quantity controls and checkout flow
- Orders list and basic status notifications
- Admin dashboard for content management

## Tech Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI), Wouter, React Hook Form, Zod, TanStack Query
- Backend: Node.js, Express
- Database/ORM: PostgreSQL (Neon compatible) with Drizzle ORM/Drizzle Kit
- Build/Tooling: Vite, tsx, esbuild, TypeScript

## Monorepo Structure
```
quickbite/
├─ client/                # React app (Vite)
│  ├─ index.html
│  └─ src/
│     ├─ components/      # UI components (shadcn/ui + custom)
│     ├─ hooks/           # Custom hooks
│     ├─ lib/             # Contexts, query client, utils
│     ├─ pages/           # Routes/pages (home, login, admin, etc.)
│     ├─ App.tsx
│     └─ main.tsx
├─ server/                # Express API and dev server integration
│  ├─ index.ts            # App bootstrap and dev/prod serve
│  ├─ routes.ts           # Route registration
│  ├─ db.ts               # DB wiring
│  ├─ storage.ts          # Storage abstraction
│  └─ vite.ts             # Vite middleware/dev setup
├─ shared/
│  └─ schema.ts           # Drizzle schema/types
├─ package.json           # Root scripts, deps
└─ drizzle.config.ts      # Drizzle Kit config
```

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon serverless works great)

## Environment Variables
Create a `.env` file in the project root with at least:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://user:password@host:5432/dbname
SESSION_SECRET=replace-with-a-long-random-string
```

## Installation
```bash
npm install
```

## Database Setup (Drizzle)
- Configure `DATABASE_URL` in `.env`
- Push schema to the database:
```bash
npm run db:push
```

## Development
Runs the Express API and the Vite dev server (via integrated setup).
```bash
npm run dev
```
Then open the served URL from the terminal logs (defaults to `http://localhost:5000`).

## Build & Production
Build client and server bundles:
```bash
npm run build
```
Start in production mode:
```bash
npm start
```

## Available Scripts
Defined in `package.json`:
- `dev`: Start the server in development (tsx) with Vite middleware
- `build`: Build client (Vite) and server (esbuild) to `dist/`
- `start`: Run compiled server from `dist/`
- `check`: Type-check with `tsc`
- `db:push`: Apply Drizzle schema to the database

## Notes
- The server always binds to `PORT` (default 5000) and serves both API and client.
- Replit usage tips are in `replit.md`.

## License
MIT


