# 1. Base image with Alpine and Bash (required by wait-for-it.sh)
FROM node:20-alpine AS base
RUN apk add --no-cache bash dos2unix

# 2. Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 3. Builder stage (compiles TS/JS & generates Prisma client)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma/
COPY . .

ENV NODE_ENV=production
RUN npx prisma generate
RUN npm run build

# 4. Production Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built application and required production node_modules
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.js ./prisma.config.js
COPY wait-for-it.sh /app/wait-for-it.sh
COPY entrypoint.sh /app/entrypoint.sh

EXPOSE 3000

# Exec form using bash so wait-for-it works reliably
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
CMD ["node", "dist/index.js"]
