# Drawlify

A real-time collaborative whiteboard built with Next.js, WebSockets, and Rough.js. Draw, sketch, and collaborate with your team on an infinite canvas.

![Preview](apps/frontend/public/preview.png)

## Features

- **Real-time collaboration** — multiple users can draw together, changes sync instantly via WebSocket
- **Hand-drawn feel** — shapes rendered with Rough.js for a natural sketchy look
- **Shape tools** — rectangle, diamond, ellipse, arrow, line, pencil, text, eraser
- **Select & resize** — click to select any shape, drag handles to resize
- **Style panel** — stroke color, fill color, stroke width, roughness
- **Dark / light mode** — toggle between themes
- **Pan & zoom** — hand tool to navigate the infinite canvas
- **Persistent canvas** — shapes saved to PostgreSQL, restored on rejoin
- **Auth** — email/password signup + Google OAuth
- **Keyboard shortcuts** — `1-0` to switch tools

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS, Framer Motion |
| Canvas | HTML5 Canvas, Rough.js |
| Real-time | WebSocket (ws) |
| HTTP API | Express 5 |
| Database | PostgreSQL (Neon) via Prisma 7 |
| Auth | JWT + Google OAuth (Passport.js) |
| Monorepo | Turborepo + pnpm workspaces |
| Deployment | Vercel (frontend), Render (backends) |

## Project Structure

```
Drawlify/
├── apps/
│   ├── frontend/          # Next.js app
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── draw/          # Canvas engine (Game, CanvasManager, InputHandler, etc.)
│   ├── http-backend/      # Express REST API (auth, rooms, shapes)
│   └── ws-backend/        # WebSocket server (real-time sync)
├── packages/
│   ├── db/                # Prisma client + schema
│   ├── backend-common/    # Shared JWT secret config
│   ├── common/            # Shared Zod validation schemas
│   └── typescript-config/ # Shared tsconfig
├── docker-compose.yml
├── render.yaml
└── vercel.json
```

## Getting Started

### Prerequisites

- Node.js 22.12+
- pnpm 9+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)

### 1. Clone and install

```bash
git clone https://github.com/Ravichandra531/DRAWLIFY.git
cd DRAWLIFY
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_HTTP_BACKEND="http://localhost:3001"
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
```

Also create `apps/http-backend/.env` and `apps/ws-backend/.env` with:

```env
DATABASE_URL="..."
JWT_SECRET="..."
```

### 3. Set up the database

```bash
cd packages/db
npx prisma db push
npx prisma generate
```

### 4. Run in development

```bash
# From repo root — starts all services
pnpm dev
```

Or run individually:

```bash
# Terminal 1 — HTTP backend (port 3001)
pnpm --filter http-backend dev

# Terminal 2 — WebSocket backend (port 8080)
pnpm --filter ws-backend dev

# Terminal 3 — Frontend (port 3000)
pnpm --filter frontend dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Create account with username, email, password |
| POST | `/login` | Sign in, returns JWT token |
| GET | `/auth/google` | Initiate Google OAuth flow |
| GET | `/auth/google/callback` | Google OAuth callback |

### Rooms

| Method | Endpoint | Description |
|---|---|---|
| POST | `/room` | Create a new board (auth required) |
| GET | `/room/:slug` | Get room by slug |

### Shapes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/shapes/:roomId` | Get all shapes for a room |
| POST | `/shapes/:roomId` | Upsert shapes (auth required) |

## Deployment

### Docker (local / VPS)

```bash
cp .env.example .env
# fill in your values

docker compose build \
  --build-arg NEXT_PUBLIC_HTTP_BACKEND=https://your-api.com \
  --build-arg NEXT_PUBLIC_WS_URL=wss://your-ws.com

docker compose up -d
```

### Render + Vercel (production)

The repo includes `render.yaml` for one-click Render deployment and `vercel.json` for Vercel.

**Render** (http-backend + ws-backend):
1. New → Blueprint → connect repo → Render reads `render.yaml`
2. Add env vars: `DATABASE_URL`, `JWT_SECRET`, `BACKEND_URL`, `FRONTEND_URL`
3. For Google OAuth also add: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Vercel** (frontend):
1. Import repo → Root Directory: leave blank
2. Add env vars: `NEXT_PUBLIC_HTTP_BACKEND`, `NEXT_PUBLIC_WS_URL`
3. Node.js version: 22.x

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `JWT_SECRET` | Backend | Secret for signing JWT tokens |
| `GOOGLE_CLIENT_ID` | http-backend | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | http-backend | Google OAuth client secret |
| `BACKEND_URL` | http-backend | Public URL of the http-backend |
| `FRONTEND_URL` | http-backend | Public URL of the frontend |
| `NEXT_PUBLIC_HTTP_BACKEND` | Frontend | HTTP backend URL (baked at build time) |
| `NEXT_PUBLIC_WS_URL` | Frontend | WebSocket backend URL (baked at build time) |

## Canvas Architecture

The canvas engine lives in `apps/frontend/draw/` and is split into focused classes:

- **`Game`** — orchestrates all managers, loads existing shapes on init
- **`CanvasManager`** — renders shapes, handles pan, hit-testing, resize handles
- **`InputHandler`** — mouse events, tool dispatch, move/resize logic
- **`TextInputManager`** — floating textarea for text tool
- **`NetworkManager`** — batches and sends shapes over WebSocket
- **`ShapeStore`** — in-memory shape map with soft deletes
- **`ToolManager`** — active tool registry
- **`Tool`** — individual tool implementations (rect, circle, arrow, etc.)


