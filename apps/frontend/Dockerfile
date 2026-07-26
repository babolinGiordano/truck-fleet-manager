# syntax=docker/dockerfile:1

# ---------- stage 1: build ----------
# Il build context e' la ROOT del monorepo (serve libs/shared + i manifest del workspace)
FROM node:20-alpine AS build

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /repo

# Manifest prima del codice: se non cambiano, l'install resta in cache
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY libs/shared/package.json libs/shared/package.json

# --filter ...frontend... installa il frontend e le sue dipendenze di workspace (libs/shared)
RUN pnpm install --frozen-lockfile --filter @truck-fleet/frontend...

# Sorgenti
COPY tsconfig.base.json ./
COPY libs/shared libs/shared
COPY apps/frontend apps/frontend

# angular.json ha defaultConfiguration: production
RUN pnpm --filter @truck-fleet/frontend build

# ---------- stage 2: runtime ----------
FROM nginx:alpine AS runtime

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# application builder (Angular 19) -> output statico in dist/<name>/browser
COPY --from=build /repo/apps/frontend/dist/truck-fleet-manager/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
