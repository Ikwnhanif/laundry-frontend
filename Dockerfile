# Stage 1: Install dependencies & Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files untuk caching layer
COPY package.json package-lock.json ./
RUN npm install

# Copy seluruh source code
COPY . .

# Build aplikasi (Next.js akan mengambil NEXT_PUBLIC_API_URL dari environment)
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Salin hasil build dari stage builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Jalankan Next.js
EXPOSE 3000
CMD ["npm", "start"]