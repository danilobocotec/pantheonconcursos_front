# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY shadcn-ui/package.json shadcn-ui/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY shadcn-ui ./
RUN pnpm build

FROM nginx:stable-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]