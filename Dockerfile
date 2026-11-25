FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/mcp/package.json ./packages/mcp/package.json
RUN npm ci

FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.base.json ./
COPY registry ./registry
COPY scripts ./scripts
COPY apps/web ./apps/web
COPY packages/mcp ./packages/mcp
COPY packages/plugin ./packages/plugin
RUN mkdir -p /app/apps/web/public
RUN npm run sync && npm run build -w packages/mcp && npm run build -w apps/web

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# The /mcp endpoint reads registry files (component code, tokens, setup.json) at runtime.
ENV RAKITEK_ROOT=/app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/registry ./registry

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
