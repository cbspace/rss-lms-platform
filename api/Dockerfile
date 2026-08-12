# 1. Base image
FROM node:22-alpine AS base
RUN apk add --no-cache bash dos2unix

# 2. Dependencies stage (Install all dependencies for building)
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 3. Builder stage (Generates Prisma Client & Next.js Standalone build)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma/
COPY . .

# Set arguments
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build

# 4. Production Runner stage (Security Hardened)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user context
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy essential files with explicit non-root ownership
COPY --chown=nextjs:nodejs package*.json ./
COPY --chown=nextjs:nodejs --from=deps /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs --from=builder /app/prisma ./prisma
COPY --chown=nextjs:nodejs --from=builder /app/prisma.config.js ./prisma.config.js 

# Copy entrypoint scripts
COPY wait-for-it.sh /app/wait-for-it.sh
COPY entrypoint.sh /app/entrypoint.sh

# Ensure executable permissions and clean UNIX line endings
RUN chmod +x /app/wait-for-it.sh /app/entrypoint.sh && \
    dos2unix /app/wait-for-it.sh /app/entrypoint.sh && \
    chown nextjs:nodejs /app/wait-for-it.sh /app/entrypoint.sh

# Switch to unprivileged user
USER nextjs

EXPOSE 3000

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
CMD ["node", "server.js"]