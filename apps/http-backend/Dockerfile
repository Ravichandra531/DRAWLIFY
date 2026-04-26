FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/db/package.json ./packages/db/
COPY packages/backend-common/package.json ./packages/backend-common/
COPY packages/common/package.json ./packages/common/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/http-backend/package.json ./apps/http-backend/
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm run build --filter=http-backend...

EXPOSE 3001
WORKDIR /app/apps/http-backend
CMD ["node", "dist/index.js"]
