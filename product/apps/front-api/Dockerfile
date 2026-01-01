FROM node:18-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./
COPY tsconfig.json ./

COPY packages/ ./packages/
COPY apps/front-api/ ./apps/front-api/

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @cms/shared build
RUN pnpm --filter @cms/cache build
RUN pnpm --filter @cms/services build
RUN pnpm --filter @cms/front-api build

FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/front-api ./apps/front-api

WORKDIR /app/apps/front-api

EXPOSE 4001

CMD ["pnpm", "start"]

