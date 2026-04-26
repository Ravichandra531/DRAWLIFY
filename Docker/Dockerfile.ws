FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# ── deps: install only when lockfile changes ──────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/db/package.json ./packages/db/
COPY packages/backend-common/package.json ./packages/backend-common/
COPY packages/common/package.json ./packages/common/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/ws-backend/package.json ./apps/ws-backend/
RUN pnpm install

# ── build ─────────────────────────────────────────────────────────────────────
FROM deps AS builder
COPY . .
RUN pnpm --filter @repo/db exec npx prisma generate
RUN pnpm run build

# ── runner ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
RUN npm install -g pnpm@9.0.0
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/ws-backend/dist ./apps/ws-backend/dist
COPY --from=builder /app/apps/ws-backend/package.json ./apps/ws-backend/

EXPOSE 8080
WORKDIR /app/apps/ws-backend
CMD ["node", "dist/index.js"]
