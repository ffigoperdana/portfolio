# Build: Node compiles the static site (fonts are fetched at build time,
# so the build stage needs network access — Coolify builds have it).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve: plain nginx with the security/caching headers baked in.
# Runtime image ≈ 12 MB, zero Node in production.
FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
