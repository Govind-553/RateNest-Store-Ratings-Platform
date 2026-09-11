# RateNest — Store Ratings Platform

A full-stack web application for discovering stores, viewing ratings, and submitting 1–5 star ratings, with role-based experiences for Administrators, Normal Users, and Store Owners.

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart LR
  U[Normal User] --> F[React Frontend]
  A[Administrator] --> F
  O[Store Owner] --> F
  F --> API[NestJS REST API]
  API --> AUTH[JWT Authentication]
  API --> P[Prisma ORM]
  P --> DB[(PostgreSQL)]
```

## Features

- **Role-based experiences** — dedicated dashboards for `ADMIN`, `USER`, and `STORE_OWNER` roles, enforced on both the client (protected routes) and the server (JWT + role guards).
- **Store discovery** — browse and search stores, sort results, and view each store's average rating.
- **Star ratings** — submit a 1–5 star rating (one per user per store) and update it anytime.
- **Account management** — register, log in, and change your password with strict validation.
- **Admin tools** — dashboard statistics, user management (list, detail, create), and store management (list, create).
- **Owner dashboard** — see the stores you own along with their ratings and recent raters.
- **Premium dark UI** — modern SaaS design system built with hand-written CSS (no UI framework), Inter typography, and an orange accent palette.

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, TypeScript, Vite, React Router 7, lucide-react icons, plain CSS |
| Backend    | NestJS 12, Prisma ORM, PostgreSQL |
| Auth       | JWT (`@nestjs/jwt` + `passport-jwt`), bcrypt password hashing |
| Validation | `class-validator` + `class-transformer` (whitelist + strict DTOs) |
| Tooling    | Vitest (unit + e2e tests), oxlint |

## Project Structure

```
RateNest-Store-Ratings-Platform/
├── README.md                 # This file
├── .gitignore
├── backend/                  # NestJS REST API
│   ├── prisma/
│   │   ├── schema.prisma     # User, Store, Rating models + Role enum
│   │   ├── seed.ts           # Demo users, stores, and ratings
│   │   └── migrations/
│   ├── src/
│   │   ├── auth/             # Login, register, JWT strategy
│   │   ├── users/            # Self-service endpoints (e.g. change password)
│   │   ├── stores/           # Store browsing and search
│   │   ├── ratings/          # Create / update star ratings
│   │   ├── admin/            # Admin-only user & store management
│   │   ├── owner/            # Store owner dashboard
│   │   ├── common/           # Guards, decorators, filters, DTOs
│   │   ├── prisma/           # Shared PrismaService
│   │   └── main.ts           # Bootstrap, global `/api` prefix, CORS
│   ├── package.json
│   ├── .env                  # Environment variables (local, git-ignored)
│   └── .env.example          # Environment template
└── frontend/                 # React SPA
    ├── public/
    ├── src/
    │   ├── pages/            # Login, Register, User/Admin/Owner pages
    │   ├── layouts/          # Authenticated dashboard shell
    │   ├── components/       # Sidebar, Navbar, Modal, RatingStars, etc.
    │   ├── services/         # Typed API client bundled per feature
    │   ├── context/          # Auth + Toast providers
    │   ├── styles/           # variables, globals, layout, components, pages, animations, responsive
    │   └── App.tsx           # Route definitions
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (18+)
- PostgreSQL

### Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev    # apply schema migrations
npm run seed              # load demo users, stores, and ratings
npm run start:dev         # http://localhost:3000 (port from PORT env)
```

Validated by `npm run build`, unit tests via `npm run test`, and e2e tests via `npm run test:e2e`. Lint with `npm run lint`.

### Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend on `http://localhost:3000`. Run `npm run build` (`tsc -b && vite build`) to type-check and produce the production bundle.

### Environment Variables

```dotenv
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
JWT_SECRET="replace-with-a-secure-random-secret"
JWT_EXPIRES_IN="1d"
PORT="3000"
```

## API Overview

All endpoints are prefixed with `/api`. Protected endpoints expect an `Authorization: Bearer <token>` header. Admin endpoints additionally require the `ADMIN` role, owner endpoints the `STORE_OWNER` role.

| Method | Endpoint                     | Access            | Description                          |
|--------|------------------------------|-------------------|--------------------------------------|
| POST   | `/api/auth/register`         | Public            | Create a normal user account         |
| POST   | `/api/auth/login`            | Public            | Authenticate and receive a JWT       |
| GET    | `/api/auth/me`               | Any authenticated | Current user profile                 |
| GET    | `/api/stores`                | Any authenticated | List / search / sort stores          |
| GET    | `/api/stores/:id`            | Any authenticated | Store detail with average rating     |
| POST   | `/api/stores/:storeId/ratings` | Any authenticated | Submit a 1–5 star rating           |
| PATCH  | `/api/stores/:storeId/ratings` | Any authenticated | Update your rating for the store   |
| PATCH  | `/api/users/me/password`     | Any authenticated | Change your password                 |
| GET    | `/api/admin/dashboard`       | `ADMIN`           | Platform statistics                  |
| GET    | `/api/admin/users`           | `ADMIN`           | List / search users                  |
| GET    | `/api/admin/users/:id`       | `ADMIN`           | User detail with ratings             |
| POST   | `/api/admin/users`           | `ADMIN`           | Create a user (any role)             |
| GET    | `/api/admin/stores`          | `ADMIN`           | List / search all stores             |
| POST   | `/api/admin/stores`          | `ADMIN`           | Create a store                       |
| GET    | `/api/owner/dashboard`       | `STORE_OWNER`     | Owner's stores, ratings, and raters  |

### Key Business Rules

- A user may rate a store **once** (unique `userId + storeId`); the rating can be updated afterwards.
- Ratings are integers between **1 and 5**.
- Registration names are **20–60 characters**; passwords are **8–16 characters** with at least one uppercase letter and one special character; addresses are capped at **400 characters**.
- Passwords are hashed with **bcrypt** (10 rounds); user-provided data is strictly whitelisted via DTOs.

## Demo Accounts

Seeded by `npm run seed`. Password for all accounts: `Password@123`

| Email                        | Role         |
|------------------------------|--------------|
| admin@storerating.com        | ADMIN        |
| user.alexander@storerating.com | USER       |
| owner.organic@storerating.com | STORE_OWNER  |
| owner.coffee@storerating.com | STORE_OWNER  |
| owner.tech@storerating.com   | STORE_OWNER  |
| user.benjamin@storerating.com | USER        |
| user.christopher@storerating.com | USER      |
| user.daniel@storerating.com  | USER         |

## Available Scripts

### Backend (`backend/`)

| Script       | Command                                   |
|--------------|-------------------------------------------|
| `build`      | `nest build`                              |
| `start:dev`  | `nest start --watch`                      |
| `start:prod` | `node dist/main`                          |
| `lint`       | `oxlint src/ test/`                       |
| `test`       | `vitest run`                              |
| `test:e2e`   | `vitest run --config ./vitest.config.e2e.ts` |
| `seed`       | `tsx prisma/seed.ts`                      |

### Frontend (`frontend/`)

| Script    | Command              |
|-----------|----------------------|
| `dev`     | `vite`               |
| `build`   | `tsc -b && vite build` |
| `lint`    | `oxlint`             |
| `preview` | `vite preview`       |