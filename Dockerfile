# ── Frontend Dockerfile ──────────────────────────────────────────
# Builds the Vite React SPA and serves it with Nginx.
#
# Usage:
#   docker build --build-arg EXA_API_KEY="..." -f Dockerfile -t wandr-frontend .
#   docker run -p 80:80 wandr-frontend
#
# Note: GEMINI_API_KEY is NOT a build argument here — it is a runtime secret
# for the backend service only and must never be baked into the client bundle.

# ── Build stage ──────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack for modern npm/pnpm/yarn, run install
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .

# Only non-sensitive, frontend-specific build args are accepted here
ARG EXA_API_KEY
ARG GMI_API_KEY

ENV VITE_EXA_API_KEY=$EXA_API_KEY
ENV VITE_GMI_API_KEY=$GMI_API_KEY

RUN npm run build

# ── Serve stage ──────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copy the built Vite output from the builder stage over to Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx config to support SPAs (fallback to index.html for React Router)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
