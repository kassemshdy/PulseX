FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy package files
COPY packages/ ./packages/
COPY apps/admin-api/ ./apps/admin-api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages
RUN pnpm --filter @cms/shared build
RUN pnpm --filter @cms/database build
RUN pnpm --filter @cms/cache build
RUN pnpm --filter @cms/services build
RUN pnpm --filter @cms/admin-api build

# Production stage
FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/admin-api ./apps/admin-api

WORKDIR /app/apps/admin-api

EXPOSE 4000

CMD ["pnpm", "start"]

