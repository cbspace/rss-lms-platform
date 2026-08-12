# 1. Base image for shared node dependencies
FROM node:22-alpine AS base

# 2. Dependencies stage (installs all deps for building)
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 3. Builder stage (compiles Next.js production build)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
# Add API_URL build arg, used for API redirects
# Must be injected prior to npm run build
ARG API_URL
ENV API_URL=$API_URL
RUN npm run build

# 4. Production Runner stage (lightweight final image)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public* ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "server.js"]
