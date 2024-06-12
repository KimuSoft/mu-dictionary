FROM node:16

ENV TZ=Asia/Seoul
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install
RUN pnpm --filter client build
RUN pnpm --filter server build
CMD ["pnpm", "--filter", "server", "migrateandstart"]

FROM postgres:16

RUN apt-get update
RUN apt-get install -y postgresql-16-wal2json
