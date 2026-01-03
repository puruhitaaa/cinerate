<p align="center">
  <h1 align="center">🎬 Cinerate</h1>
  <p align="center">
    <strong>A modern movie rating and review platform</strong>
  </p>
  <p align="center">
    Built with <a href="https://github.com/AmanVarshney01/create-better-t-stack">Better-T-Stack</a> — a cutting-edge TypeScript monorepo stack
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Native-61DAFB?logo=react&logoColor=000" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=fff" alt="Expo" />
  <img src="https://img.shields.io/badge/Elysia-8B5CF6?logo=elysia&logoColor=fff" alt="Elysia" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff" alt="Prisma" />
</p>

---

## 📖 Overview

**Cinerate** is a full-stack mobile application that allows users to discover movies, read reviews, and share their own ratings with the community. It leverages the [TMDB API](https://www.themoviedb.org/documentation/api) for comprehensive movie data and provides a seamless experience for movie enthusiasts.

### ✨ Key Features

- 🎥 **Movie Discovery** — Browse trending, now playing, and search for movies
- ⭐ **Reviews & Ratings** — Write reviews with spoiler warnings, rate movies 1-5 stars
- 📱 **Cross-Platform** — Native mobile app (iOS & Android) with Expo
- 🔐 **Secure Authentication** — Better-Auth with Expo integration
- 🚀 **End-to-End Type Safety** — oRPC with Zod validation
- ♾️ **Infinite Scrolling** — Smooth, performant movie browsing with cursor-based pagination
- 🎬 **Trailer Playback** — Watch movie trailers directly in the app

---

## 🏗️ Tech Stack

### Frontend (Mobile)

| Package                                                                                  | Description                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------ |
| [React Native](https://reactnative.dev/)                                                 | Cross-platform mobile framework      |
| [Expo](https://expo.dev/)                                                                | React Native development toolkit     |
| [expo-router](https://docs.expo.dev/router/introduction/)                                | File-based routing for React Native  |
| [TanStack Query](https://tanstack.com/query)                                             | Async state management & caching     |
| [@shopify/flash-list](https://shopify.github.io/flash-list/)                             | Performant lists for infinite scroll |
| [HeroUI Native](https://github.com/heroui-inc/heroui-native)                             | Native UI components                 |
| [Tailwind CSS](https://tailwindcss.com/) + [uniwind](https://github.com/nicepkg/uniwind) | Utility-first styling                |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)           | Smooth animations                    |
| [@gorhom/bottom-sheet](https://gorhom.dev/react-native-bottom-sheet/)                    | Bottom sheet components              |
| [react-native-youtube-iframe](https://lonelycpp.github.io/react-native-youtube-iframe/)  | YouTube video playback               |

### Backend

| Package                                   | Description                                |
| ----------------------------------------- | ------------------------------------------ |
| [Elysia](https://elysiajs.com/)           | Type-safe, high-performance HTTP framework |
| [oRPC](https://orpc.dev/)                 | End-to-end type-safe APIs with OpenAPI     |
| [Bun](https://bun.sh/)                    | Fast JavaScript runtime & package manager  |
| [Better-Auth](https://better-auth.com/)   | Authentication framework                   |
| [Prisma](https://www.prisma.io/)          | TypeScript-first ORM                       |
| [PostgreSQL](https://www.postgresql.org/) | Relational database                        |

### Shared Packages

| Package          | Description                            |
| ---------------- | -------------------------------------- |
| `@cinerate/api`  | Shared API routers and business logic  |
| `@cinerate/auth` | Authentication configuration           |
| `@cinerate/db`   | Database schema and Prisma client      |
| `@cinerate/env`  | Shared environment variable validation |

### Developer Experience

| Tool                                          | Description                     |
| --------------------------------------------- | ------------------------------- |
| [Turborepo](https://turbo.build/)             | Optimized monorepo build system |
| [Biome](https://biomejs.dev/)                 | Fast linter & formatter         |
| [TypeScript](https://www.typescriptlang.org/) | Static type checking            |

---

## 📁 Project Structure

```
cinerate/
├── apps/
│   ├── native/         # 📱 React Native mobile app (Expo)
│   └── server/         # 🖥️  Backend API (Elysia + oRPC)
├── packages/
│   ├── api/            # 🔌 Shared API routers & types
│   ├── auth/           # 🔐 Authentication logic (Better-Auth)
│   ├── db/             # 🗃️  Database schema (Prisma)
│   └── env/            # 🌍 Environment variable validation
├── turbo.json          # ⚡ Turborepo configuration
└── package.json        # 📦 Root workspace configuration
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **[Bun](https://bun.sh/)** (v1.3.0+) — JavaScript runtime & package manager
- **[Node.js](https://nodejs.org/)** (v18+) — Required for some tooling
- **[PostgreSQL](https://www.postgresql.org/)** (v14+) — Database
- **[Expo Go](https://expo.dev/client)** — Mobile app for testing (iOS/Android)
- **[TMDB API Key](https://developer.themoviedb.org/docs/getting-started)** — For movie data

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/puruhitaaa/cinerate.git
cd cinerate
```

### 2️⃣ Install Dependencies

```bash
bun install
```

### 3️⃣ Configure Environment Variables

This project requires environment variables to be set in two locations:

#### Server Environment (`apps/server/.env`)

Create a `.env` file in `apps/server/` with the following variables:

```env
# 🔐 Authentication (Better-Auth)
# Generate a secure secret: openssl rand -base64 32
BETTER_AUTH_SECRET=your_super_secret_key_here

# 🌐 Better-Auth URL
# The URL where your auth server is accessible
BETTER_AUTH_URL=http://localhost:3000

# 🔗 CORS Origin
# Allowed origins for cross-origin requests (your frontend URL)
CORS_ORIGIN=http://localhost:8081

# 🗄️ Database Connection
# PostgreSQL connection string
DATABASE_URL=postgresql://username:password@localhost:5432/cinerate?schema=public

# 🎬 TMDB API Key
# Get your API key from: https://developer.themoviedb.org/docs/getting-started
# Supports both v3 API keys (32 chars) and v4 read access tokens
TMDB_API_KEY=your_tmdb_api_key_here
```

| Variable             | Description                                                                 | Example                                          |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| `BETTER_AUTH_SECRET` | Secret key for signing auth tokens. Generate with `openssl rand -base64 32` | `abc123...`                                      |
| `BETTER_AUTH_URL`    | Public URL of your auth server                                              | `http://localhost:3000`                          |
| `CORS_ORIGIN`        | Allowed origin for CORS (native app dev server)                             | `http://localhost:8081`                          |
| `DATABASE_URL`       | PostgreSQL connection string                                                | `postgresql://user:pass@localhost:5432/cinerate` |
| `TMDB_API_KEY`       | Your TMDB API key (v3 or v4 token)                                          | `abc123def456...`                                |

#### Native App Environment (`apps/native/.env`)

Create a `.env` file in `apps/native/` with the following variable:

```env
# 🖥️ Server URL
# The URL where your backend API is running
# For local development with physical device, use your machine's local IP
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

| Variable                 | Description                   | Example                     |
| ------------------------ | ----------------------------- | --------------------------- |
| `EXPO_PUBLIC_SERVER_URL` | URL of the backend API server | `http://192.168.1.100:3000` |

> **📱 Note for Physical Devices:** When testing on a physical device, replace `localhost` with your machine's local IP address (e.g., `http://192.168.1.100:3000`). You can find your IP with `ipconfig` (Windows) or `ifconfig` (macOS/Linux).

### 4️⃣ Set Up the Database

Generate the Prisma client and push the schema to your database:

```bash
bun run db:push
```

### 5️⃣ Generate Auth Types

Generate Better-Auth types (optional but recommended):

```bash
bun run auth:generate
```

### 6️⃣ Start Development Servers

Start all applications in development mode:

```bash
bun run dev
```

Or start services individually:

```bash
# Start only the backend server
bun run dev:server

# Start only the native app (in a separate terminal)
bun run dev:native
```

### 7️⃣ Access the Application

- **📱 Native App:** Open Expo Go on your device and scan the QR code
- **🖥️ API Server:** [http://localhost:3000](http://localhost:3000)
- **📊 Database Studio:** Run `bun run db:studio` to open Prisma Studio

---

## 📜 Available Scripts

| Script                  | Description                         |
| ----------------------- | ----------------------------------- |
| `bun run dev`           | Start all apps in development mode  |
| `bun run build`         | Build all applications              |
| `bun run check-types`   | TypeScript type checking            |
| `bun run check`         | Run Biome linter & formatter        |
| `bun run dev:native`    | Start React Native/Expo development |
| `bun run dev:server`    | Start backend API server            |
| `bun run db:push`       | Push Prisma schema to database      |
| `bun run db:studio`     | Open Prisma Studio (database GUI)   |
| `bun run db:generate`   | Generate Prisma client              |
| `bun run db:migrate`    | Run database migrations             |
| `bun run db:reset`      | Reset database (⚠️ destructive)     |
| `bun run auth:generate` | Generate Better-Auth types          |

---

## 🗃️ Database Schema

Cinerate uses a PostgreSQL database with the following main entities:

### Core Models

- **User** — User accounts and authentication (managed by Better-Auth)
- **Review** — Movie reviews with ratings, spoiler flags, and content
  - Rating: 1-5 stars
  - Spoiler warnings
  - One review per user per movie

---

## 🎬 TMDB API Integration

Cinerate integrates with [The Movie Database (TMDB)](https://www.themoviedb.org/) API for:

- **Trending Movies** — Daily/weekly trending content
- **Now Playing** — Currently in theaters
- **Search** — Full-text movie search
- **Movie Details** — Comprehensive movie information with cast & crew
- **Videos** — Trailers, teasers, and featurettes
- **Discover** — Advanced filtering with genres, years, and sorting
- **Genres** — Complete genre list for filtering

> **📝 Getting a TMDB API Key:**
>
> 1. Create an account at [themoviedb.org](https://www.themoviedb.org/)
> 2. Go to Settings → API
> 3. Request an API key (free for non-commercial use)
> 4. Copy either the v3 API key or v4 Read Access Token
