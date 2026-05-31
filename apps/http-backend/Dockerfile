FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# ── Install all dependencies (including devDeps for build tools) ──────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/db/package.json             ./packages/db/
COPY packages/backend-common/package.json ./packages/backend-common/
COPY packages/common/package.json         ./packages/common/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/http-backend/package.json       ./apps/http-backend/
# No --prod flag so devDependencies (tsc, turbo) are available for building
RUN pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
FROM deps AS builder
# Install turbo globally so the `pnpm run build` script can invoke it
RUN npm install -g turbo@latest
COPY . .
RUN pnpm run build --filter=http-backend...

# ── Production image ──────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app/apps/http-backend

# Copy only compiled output and production node_modules
COPY --from=builder /app/apps/http-backend/dist ./dist
COPY --from=builder /app/node_modules            /app/node_modules
COPY --from=builder /app/packages                /app/packages

EXPOSE 3001
CMD ["node", "dist/index.js"]
