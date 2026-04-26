FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# ── deps: cache layer — only reinstalls when lockfile changes ─────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/db/package.json                    ./packages/db/
COPY packages/backend-common/package.json        ./packages/backend-common/
COPY packages/common/package.json                ./packages/common/
COPY packages/typescript-config/package.json     ./packages/typescript-config/
COPY apps/ws-backend/package.json                ./apps/ws-backend/
RUN pnpm install --frozen-lockfile

# ── builder: full source + turbo build (builds @repo/db first via ^build) ─────
FROM deps AS builder
COPY . .
RUN pnpm run build --filter=ws-backend...

# ── runner: lean production image ─────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/node_modules                         ./node_modules
COPY --from=builder /app/packages/db/dist                     ./packages/db/dist
COPY --from=builder /app/packages/db/package.json             ./packages/db/package.json
COPY --from=builder /app/packages/backend-common/dist         ./packages/backend-common/dist
COPY --from=builder /app/packages/backend-common/package.json ./packages/backend-common/package.json
COPY --from=builder /app/packages/common/dist                 ./packages/common/dist
COPY --from=builder /app/packages/common/package.json         ./packages/common/package.json
COPY --from=builder /app/apps/ws-backend/dist                 ./apps/ws-backend/dist
COPY --from=builder /app/apps/ws-backend/package.json         ./apps/ws-backend/package.json

EXPOSE 8080
WORKDIR /app/apps/ws-backend
CMD ["node", "dist/index.js"]
