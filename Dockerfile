FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build
RUN npm run build

# Production
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["npx", "next", "start", "-p", "3000"]
