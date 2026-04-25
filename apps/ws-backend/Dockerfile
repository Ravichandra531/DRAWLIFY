FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.0.0

COPY . .

RUN pnpm install

RUN cd packages/db && npx prisma generate

RUN pnpm run build

EXPOSE 8080

WORKDIR /app/apps/ws-backend
CMD ["pnpm", "run", "start"]
