FROM node:20-alpine AS base

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# ------------------------------------------------------------------------------
# Dependencies Stage
# ------------------------------------------------------------------------------
FROM base AS deps

# Install dependencies needed for build (including devDependencies)
RUN pnpm install --frozen-lockfile

# ------------------------------------------------------------------------------
# Build Stage
# ------------------------------------------------------------------------------
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build the application
RUN pnpm build

# Prune dev dependencies for production
RUN pnpm prune --prod --ignore-scripts

# ------------------------------------------------------------------------------
# Production Stage
# ------------------------------------------------------------------------------
FROM base AS runner

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Create a non-root user (optional but recommended)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Expose port (default 3000)
EXPOSE 3000

# Start command
CMD ["node", "dist/server.js"]
