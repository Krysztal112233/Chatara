# Frontend build stage
FROM docker.io/library/node:22-slim AS frontend-builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Copy only package files first for better caching
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code and build
COPY frontend/ ./
RUN pnpm run build

# Backend build stage
FROM docker.io/library/rust:slim-trixie AS backend-builder
WORKDIR /builder
RUN apt update && apt install build-essential curl wget file libssl-dev pkg-config -y
COPY ./backend/ .
RUN cargo build --all -r

# Frontend production stage
FROM nginxinc/nginx-unprivileged:stable-alpine-slim AS frontend
COPY --from=frontend-builder /app/dist /app
COPY frontend/docker/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /app
EXPOSE 8080

# Backend production stage
FROM docker.io/library/debian:trixie-slim AS backend
WORKDIR /app
COPY --from=backend-builder /builder/target/release/charata /app/
CMD [ "./charata" ]
