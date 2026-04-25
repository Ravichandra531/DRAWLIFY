FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN pnpm fetch

COPY . .

RUN pnpm install --frozen-lockfile --prefer-offline

RUN pnpm --filter @repo/db exec npx prisma generate

RUN pnpm run build

EXPOSE 8080

WORKDIR /app/apps/ws-backend
CMD ["node", "dist/index.js"]
